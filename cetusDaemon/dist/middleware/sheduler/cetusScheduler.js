"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendProperty = exports.Initial = exports.Scheduler = void 0;
const cetus_SystemConstant_1 = require("../../protocol/cetus_SystemConstant");
const child_process_1 = require("child_process");
const excuteJob_1 = require("../../util/excuteJob");
let scheduler = undefined;
let MaxGPUNumber = 10;
class Scheduler {
    constructor() {
        this.workerSet = {}; // type = Worker
        this.Queue_wating = [];
        this.gpuDictionary = {}; // type = GpuWraper
        this.jobDictionary = {}; // type = JobWraper
        // init queue
        for (let i = 0; i < MaxGPUNumber + 1; i++) {
            this.Queue_wating.push(new JobQueue(i));
        }
        //
        this.refreshWorkerList();
        console.log({ workerSet: this.workerSet });
    }
    pin() {
        return { message: 'hi~ I am Ceutus Scheduler!' };
    }
    // APIserver use dispatch to dispatch an event to scheduler
    dispatchEvent(request) {
        console.log('dispatchEvent is called');
        if (request.method == cetus_SystemConstant_1.ShcedulerMethod.PUSH) {
            let payload = request.payload;
            console.log({ pushTask: payload });
            if (this.jobDictionary[payload.job.podName]) {
                // process already pushed
            }
            else {
                // regist dictionary
                this.jobDictionary[payload.job.podName] = {};
                this.jobDictionary[payload.job.podName].jobInfo = payload.job;
                this.jobDictionary[payload.job.podName].assigned = false;
                if (payload.target) {
                    this.jobDictionary[payload.job.podName].Node = payload.target;
                }
                // push into target queue
                this.Queue_wating[payload.job.gpuRequest].push(payload.job);
            }
            this.dispatchJob();
            return {
                massage: `success push job! ${payload.job.podName}`
            };
        }
        else if (request.method == cetus_SystemConstant_1.ShcedulerMethod.RETRIEVE) {
            let payload = request.payload;
            console.log({ listTask: payload });
            let resObj = {};
            if (payload.sourceType == 'node') {
                if (payload.all) {
                    resObj = scheduler.workerSet;
                }
                else {
                    resObj = {
                        massage: 'Now can only list all node, please add `--all` flag!'
                    };
                }
            }
            else if (payload.sourceType == 'queue') {
                if (payload.all) {
                    resObj = scheduler.Queue_wating;
                }
                else {
                }
            }
            console.log({ retriev: resObj });
            return resObj;
        }
        else if (request.method == cetus_SystemConstant_1.ShcedulerMethod.REMOVE) {
            let podName = request.payload;
            let wraper = this.jobDictionary[podName];
            console.log({ REMOVEPod: podName });
            console.log({ JobObj: wraper });
            if (!wraper) {
                return { message: 'Unknown job: ' + podName };
            }
            if (wraper.assigned) {
                let node = scheduler.workerSet[wraper.Node];
                console.log({ targetNode: node });
                node.finishJob(podName);
            }
            else {
                let queue = scheduler.Queue_wating[wraper.jobInfo.gpuRequest];
                queue.remove(podName);
            }
            delete scheduler.jobDictionary[podName];
            return { message: 'success delete job: ' + podName };
        }
    }
    // reloadWorkerList use "kubectl get nodes" & "kubectl describe node <name>" to update workerSet
    refreshWorkerList() {
        let nodeList = this.getWorkerList();
        let ref = this;
        nodeList.forEach(el => {
            if (!(el in ref.workerSet)) {
                ref.workerSet[el] = new Worker(el);
                let targetNode = ref.workerSet[el];
                if (this.gpuDictionary[targetNode.gpu_Capacity]) {
                    let dictionary = this.gpuDictionary[targetNode.gpu_Capacity];
                    if (!dictionary.nodeDictionary[el]) {
                        dictionary.nodeDictionary[el] = el;
                    }
                }
                else {
                    this.gpuDictionary[targetNode.gpu_Capacity] = {
                        number: targetNode.gpu_Capacity,
                        nodeDictionary: {}
                    };
                    this.gpuDictionary[targetNode.gpu_Capacity].nodeDictionary[el] = el;
                }
            }
        });
    }
    dispatchJob() {
        for (let i = MaxGPUNumber; i >= 0; i--) {
            while (this.Queue_wating[i].mapAJobToNode()) {
                // do noting
            }
        }
    }
    selectNode(gpuNum) {
        for (let el in scheduler.workerSet) {
            let node = scheduler.workerSet[el];
            if (!node.disabled && (node.gpu_Availible >= gpuNum)) {
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
    migrate(podName, sourceNode, targetNode) {
    }
    retrieve(nodeName) {
    }
    List_All() {
    }
    push(job, nodeName) {
    }
    getWorkerList() {
        console.log('in getWorkerList');
        let list = [];
        let info = child_process_1.spawnSync('kubectl', ['get', 'nodes']);
        let allNodeInfoLine = info.stdout.toString().trim().split('\n');
        allNodeInfoLine.splice(0, 1);
        allNodeInfoLine.forEach(element => {
            let value = element.split(' ');
            list.push(value[0].trim());
        });
        console.log(list);
        console.log('end getWorkerList');
        return list;
    }
}
exports.Scheduler = Scheduler;
class Worker {
    constructor(name) {
        this.gpu_Capacity = 0;
        this.gpu_Availible = 0;
        this.memory_Capacity = 0;
        this.jobSet = {}; // type = Job
        this.disabled = false;
        let info = child_process_1.spawnSync('kubectl', ['describe', 'node', name]);
        let findCapacity = /Capacity:(.*)Allocatable:/m;
        let capacity = info.stdout.toString().replace(/\n/g, ' ^@% ').match(findCapacity)[1].split('^@%');
        capacity = capacity.slice(1, capacity.length - 1);
        let infoPair = capacity.map(el => {
            let pair = el.split(':');
            return {
                key: pair[0].trim(),
                value: pair[1].trim()
            };
        });
        let obj = {};
        infoPair.forEach(el => {
            obj[el.key] = el.value;
        });
        // set gpu info
        if (obj['nvidia.com/gpu']) {
            this.gpu_Capacity = Number.parseInt(obj['nvidia.com/gpu'], 10);
            this.gpu_Availible = this.gpu_Capacity;
        }
        // set cpu info
        // set mem info
        if (obj['memory']) {
            this.memory_Capacity; // 
            this.gpu_Availible = this.gpu_Capacity;
        }
    }
    acceptJob(job) {
        if (this.gpu_Availible >= job.gpuRequest) {
            this.gpu_Availible -= job.gpuRequest;
            this.jobSet[job.podName] = job;
            // exe
            excuteJob_1.exe(job.yamlPath);
            return true;
        }
        return false;
    }
    // finish means no matter success or terminate
    finishJob(podName) {
        let info = this.jobSet[podName];
        // gpu 返して
        this.gpu_Availible += info.gpuRequest;
        delete this.jobSet[podName];
    }
    disable() {
        this.disabled = true;
    }
    enable() {
        this.disabled = false;
    }
}
class JobQueue {
    constructor(gpuNumber) {
        this.Queue = [];
        this.gpuRequestNum = gpuNumber;
    }
    listAll() {
        console.log('listAll is run');
    }
    mapAJobToNode() {
        if (this.Queue.length > 0) {
            let TargetJobWapper = scheduler.jobDictionary[this.Queue[0]];
            console.log(`${TargetJobWapper.jobInfo.podName} is mapping to node!`);
            for (let i = this.gpuRequestNum; i < MaxGPUNumber + 1; i++) {
                if (scheduler.gpuDictionary[i]) {
                    let dic = scheduler.gpuDictionary[i];
                    for (let el in dic.nodeDictionary) {
                        let node = scheduler.workerSet[el];
                        console.log(`${TargetJobWapper.jobInfo.podName} is mapping to ${el}!`);
                        if (node.acceptJob(TargetJobWapper.jobInfo)) {
                            console.log(`${TargetJobWapper.jobInfo.podName} is mapped to ${el}!`);
                            TargetJobWapper.assigned = true;
                            TargetJobWapper.Node = el;
                            this.Queue.splice(0, 1);
                            return true;
                        }
                    }
                }
            }
            console.log(`${TargetJobWapper.jobInfo.podName} is mapping failed, no availibel node!`);
            return false;
        }
    }
    push(job) {
        this.Queue.push(job.podName);
    }
    pop() {
        if (this.Queue.length == 0) {
            return undefined;
        }
        else {
            let target_job = this.Queue[0];
            this.Queue.splice(0, 1);
            return target_job;
        }
    }
    remove(podName) {
        this.Queue.splice(this.Queue.indexOf(podName), 1);
    }
}
function Initial() {
    scheduler = new Scheduler();
}
exports.Initial = Initial;
function appendProperty(req, res, next) {
    req.scheduler = scheduler;
    next();
}
exports.appendProperty = appendProperty;
//# sourceMappingURL=cetusScheduler.js.map