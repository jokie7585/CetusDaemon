import { SchedulerAccessObj, Job } from '../../protocol/cetus_protocol';
import { C_Request } from '../../util/Type';
import { NextFunction, Response } from 'express';
export declare class Scheduler {
    workerSet: any;
    Queue_wating: Array<JobQueue>;
    gpuDictionary: any;
    jobDictionary: any;
    constructor();
    pin(): {
        message: string;
    };
    dispatchEvent(request: SchedulerAccessObj): {};
    refreshWorkerList(): void;
    dispatchJob(): void;
    selectNode(gpuNum: number): string;
    nodeManage(): void;
    sendJsonResponse(): void;
    private migrate;
    private retrieve;
    private List_All;
    private push;
    private getWorkerList;
}
declare class JobQueue {
    Queue: Array<string>;
    gpuRequestNum: number;
    constructor(gpuNumber: number);
    listAll(): void;
    mapAJobToNode(): boolean;
    push(job: Job): void;
    pop(): string;
    remove(podName: string): void;
}
export declare function Initial(): void;
export declare function appendProperty(req: C_Request, res: Response, next: NextFunction): void;
export {};
