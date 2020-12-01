import {} from '../protocol/cetus_SystemConstant'

export interface cetus_protocol {
    header: cetusHeader,
    body: SchedulerAccessObj | LoggingAccessObj
}

export interface cetusHeader {
    type: 'response' | 'request',
    serviceName: string
}

type ShcedulerMethodType = 'push' | 'retrieve' | 'remove' | 'reschedule' | 'statusManage';

export interface SchedulerAccessObj {
    method: ShcedulerMethodType,
    payload: pushTask | RescheduleTask | listTask | string
}

export interface Job {
    userId: string,
    workspace: string,
    branch: string,
    podName: string,
    yamlPath: string,
    gpuRequest: number,
    CpuRequest: string,
    MemoryRequest: string
}

export interface listTask{
    sourceType: 'node' | 'queue'
    all: boolean,
    name?:string
}


export interface pushTask {
    job: Job,
    target?: string,
    position?: number
}

export interface RescheduleTask {
    type: 'insert' | 'reschedule' | 'disptchJob',
    podName: string,
    target?: string,
}


export interface LoggingAccessObj {

}

export interface ManagerAccessObj {

}