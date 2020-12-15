import {CytusAppStatus, UserCredit, ShcedulerMethod} from '../../protocol/cetus_SystemConstant'
import {SchedulerAccessObj, Job,pushTask,listTask} from '../../protocol/cetus_protocol'
import {C_Request} from '../../util/Type'
import {NextFunction, Request, Response} from 'express'
import {spawnSync} from 'child_process'
import {exe} from '../../util/excuteJob'
import {countMemory,testMemoryPositive} from '../../util/UnitCoversion'

let scheduler: Scheduler = undefined;
let MaxGPUNumber: number = 10;

interface JobWraper {
    jobInfo: Job,
    Node?: string
    assigned: boolean
}

interface GpuWraper {
    number: number,
    nodeDictionary:any // string
}


export class Scheduler {
    workerSet: any = {}; // type = Worker
    Queue_wating: Array<JobQueue> = []
    gpuDictionary: any = {}; // type = GpuWraper
    jobDictionary:any = {}; // type = JobWraper
    constructor() {
        // init queue
        for(let i = 0; i < MaxGPUNumber+1; i ++) {
            this.Queue_wating.push(new JobQueue(i))
        }
        //
        this.refreshWorkerList()

        console.log({workerSet: this.workerSet})
    }

    pin(){
        return {message : 'hi~ I am Ceutus Scheduler!'}
    }

    // APIserver use dispatch to dispatch an event to scheduler
    dispatchEvent(request: SchedulerAccessObj) {
        console.log('dispatchEvent is called')
        if(request.method == ShcedulerMethod.PUSH) {
            let payload = request.payload as pushTask
            console.log({pushTask: payload})
            if(this.jobDictionary[payload.job.podName]) {
                // process already pushed
            }
            else {
                // regist dictionary
                this.jobDictionary[payload.job.podName] = {} as JobWraper
                this.jobDictionary[payload.job.podName].jobInfo = payload.job
                this.jobDictionary[payload.job.podName].assigned = false
                if(payload.target) {
                    this.jobDictionary[payload.job.podName].Node = payload.target;
                }
                // push into target queue
                this.Queue_wating[payload.job.gpuRequest].push(payload.job);
            }

            this.dispatchJob()

            return {
                massage: `success push job! ${payload.job.podName}`
            }

        }
        else if(request.method == ShcedulerMethod.RETRIEVE) {
            let payload = request.payload as listTask
            console.log({listTask: payload})
            let resObj = {};
            if(payload.sourceType == 'node') {
                if(payload.all) {
                    resObj = scheduler.workerSet;
                }
                else {
                    resObj = {
                        massage: 'Now can only list all node, please add `--all` flag!'
                    }
                }
            }
            else if(payload.sourceType == 'queue') {
                if(payload.all) {
                    resObj = scheduler.Queue_wating;
                }
                else {

                }
            }
            console.log({retriev: resObj})

            return resObj;
        }
        else if(request.method == ShcedulerMethod.REMOVE) {
            let podName = request.payload as string
            let wraper = this.jobDictionary[podName] as JobWraper
            console.log({REMOVEPod: podName})
            console.log({JobObj: wraper})
            if(!wraper) {
                return {message: 'Unknown job: ' + podName}
            }

            if(wraper.assigned) {
                let node = scheduler.workerSet[wraper.Node] as Worker
                console.log({targetNode: node})
                node.finishJob(podName);
            }
            else {
                let queue = scheduler.Queue_wating[wraper.jobInfo.gpuRequest] as JobQueue
                queue.remove(podName);
            }

            delete scheduler.jobDictionary[podName]
            return {message: 'success delete job: ' + podName}
        }
    }

    // reloadWorkerList use "kubectl get nodes" & "kubectl describe node <name>" to update workerSet
    refreshWorkerList() {
        let nodeList = this.getWorkerList();
        let ref = this;
        nodeList.forEach(el => {
            if(!(el in ref.workerSet)) {
                ref.workerSet[el] = new Worker(el)
                let targetNode = ref.workerSet[el] as Worker
                if(this.gpuDictionary[targetNode.gpu_Capacity]) {
                    let dictionary = this.gpuDictionary[targetNode.gpu_Capacity]as GpuWraper
                    if(!dictionary.nodeDictionary[el]) {
                        dictionary.nodeDictionary[el] = el
                    }
                }
                else {
                    this.gpuDictionary[targetNode.gpu_Capacity] = {
                        number: targetNode.gpu_Capacity,
                        nodeDictionary: {}
                    } as GpuWraper

                    this.gpuDictionary[targetNode.gpu_Capacity].nodeDictionary[el] = el
                }
            }
        });
    }

    dispatchJob() {
        for(let i = MaxGPUNumber; i>= 0; i --) {
            while(this.Queue_wating[i].mapAJobToNode()) {
                // do noting
            }
        }
    }

    selectNode(gpuNum:number): string {
        for(let el in scheduler.workerSet) {
            let node = scheduler.workerSet[el] as Worker
            if(!node.disabled && (node.gpu_Availible >= gpuNum)) {
                return el;
            }
        }
        return undefined;
    }

    nodeManage() {

    }

    sendJsonResponse() {

    }

    //
    private migrate(podName: string, sourceNode:string, targetNode:string) {

    }

    private retrieve(nodeName: string) {

    }

    private List_All(){

    }

    private push(job: Job, nodeName: string) {

    }

    private getWorkerList(): Array<string> {
        console.log('in getWorkerList')
        let list = [] as Array<string> 
        let info = spawnSync('kubectl', ['get', 'nodes'])
        let allNodeInfoLine = info.stdout.toString().trim().split('\n')
        allNodeInfoLine.splice(0,1);
        allNodeInfoLine.forEach(element => {
            let value = element.split(' ')
            list.push(value[0].trim())
        });
        console.log(list)
        console.log('end getWorkerList')
        return list
    }

    
}

class Worker {
    gpu_Capacity: number = 0;
    gpu_Availible: number = 0;
    cpu_Capacity:number = 0
    cpu_Availible:number = 0
    memory_Capacity: string
    memory_Availible: string
    jobSet: any = {}; // type = Job
    disabled: boolean = false;

    constructor(name: string) {
        let info = spawnSync('kubectl', ['describe', 'node', name])

        let findCapacity = /Capacity:(.*)Allocatable:/m;

        let capacity = info.stdout.toString().replace(/\n/g, ' ^@% ').match(findCapacity)[1].split('^@%');
        capacity = capacity.slice(1, capacity.length-1);

        let infoPair = capacity.map(el => {
            let pair = el.split(':');
            return {
                key: pair[0].trim(),
                value: pair[1].trim()
            };
        });

        let obj:any = {};
        infoPair.forEach(el => {
            obj[el.key] = el.value;
        });

        // console.log({getInfoObj:obj})

        // set gpu info
        if(obj['nvidia.com/gpu']) {
            this.gpu_Capacity = Number.parseInt(obj['nvidia.com/gpu'], 10);
            this.gpu_Availible = this.gpu_Capacity;
        }

        // set cpu info
        if(obj['cpu']) {
            this.cpu_Capacity =  Number.parseInt(obj['cpu'], 10);
            this.cpu_Availible = this.cpu_Capacity;
        }

        // set mem info
        if(obj['memory']) {
            this.memory_Capacity =  obj['memory'];
            this.memory_Availible = this.memory_Capacity
        }
    }

    acceptJob(job: Job): boolean {
        console.log('in Node accept job');
        console.log({memoryCount: {
            availible: this.memory_Availible,
            req: job.MemoryRequest,
            result: countMemory('sub', this.memory_Availible, job.MemoryRequest)
        }})
        if(this.gpu_Availible >= job.gpuRequest && this.cpu_Availible >= Number.parseInt(job.CpuRequest, 10) && this.IsMemoryOk(job.MemoryRequest)) {
            this.gpu_Availible -= job.gpuRequest;
            this.cpu_Availible -= Number.parseInt(job.CpuRequest, 10)
            this.memory_Availible = countMemory('sub', this.memory_Availible, job.MemoryRequest);
            this.jobSet[job.podName] = job;
            // exe
            exe(job.yamlPath);
            return true;
        }

        return false;
    }

    // finish means no matter success or terminate
    finishJob(podName: string) {
        let info = this.jobSet[podName] as Job
        // gpu 返して
        this.gpu_Availible += info.gpuRequest;
        this.cpu_Availible += Number.parseInt(info.CpuRequest, 10)
        this.memory_Availible = countMemory('add', this.memory_Availible, info.MemoryRequest);
        delete this.jobSet[podName];
    }

    disable(){
        this.disabled = true;
    }

    enable(){
        this.disabled = false;
    }

    //
    private IsMemoryOk(requestString:string): boolean {
        let memRemain = countMemory('sub', this.memory_Availible, requestString);
        if(testMemoryPositive(memRemain)) {
            return true;
        }
        else {
            return false
        }
    }
    
}

class JobQueue {
    Queue: Array<string>
    gpuRequestNum: number
    constructor(gpuNumber: number) {
        this.Queue = [];
        this.gpuRequestNum = gpuNumber;
    }

    listAll() {
        console.log('listAll is run')
    }

    mapAJobToNode(): boolean {

        if(this.Queue.length > 0) {
            let TargetJobWapper = scheduler.jobDictionary[this.Queue[0]] as JobWraper
            console.log(`${TargetJobWapper.jobInfo.podName} is mapping to node!`)
            for(let i = this.gpuRequestNum; i < MaxGPUNumber+1; i++) {
                if(scheduler.gpuDictionary[i]) {
                    let dic = scheduler.gpuDictionary[i] as GpuWraper
                    for(let el in dic.nodeDictionary) {
                        let node = scheduler.workerSet[el] as Worker
                        console.log(`${TargetJobWapper.jobInfo.podName} is mapping to ${el}!`)
                        if(node.acceptJob(TargetJobWapper.jobInfo)) {
                            console.log(`${TargetJobWapper.jobInfo.podName} is mapped to ${el}!`)
                            TargetJobWapper.assigned = true;
                            TargetJobWapper.Node=el
                            this.Queue.splice(0,1);
                            return true;
                        } 
                    }
                }
            }

            console.log(`${TargetJobWapper.jobInfo.podName} is mapping failed, no availibel node!`)
            return false;
        }

    }

    push(job:Job) {
        this.Queue.push(job.podName)
    }

    pop(){
        if(this.Queue.length == 0) {
            return undefined
        }
        else {
            let target_job = this.Queue[0]
            this.Queue.splice(0,1)
            return target_job
        }
    }

    remove(podName: string) {
        this.Queue.splice(this.Queue.indexOf(podName), 1);
    }


}

export function Initial() {
    scheduler = new Scheduler();
}

export function appendProperty(req: C_Request, res: Response, next:NextFunction) {
    req.scheduler = scheduler;
    next();
}


