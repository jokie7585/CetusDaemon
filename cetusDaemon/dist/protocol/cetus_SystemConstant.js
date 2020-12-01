"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredit = exports.ShcedulerMethod = exports.CytusService = exports.CytusBatchStatus = exports.CytusAppStatus = void 0;
exports.CytusAppStatus = {
    WAIT: 'waiting',
    PENDING: 'pending',
    RUNNING: 'running',
    COMPLETE: 'completed',
    Terminate: 'terminate',
    // undefined is used when client first generate branch Record(But not push to Server)
    UNDEFINED: 'undefined',
};
exports.CytusBatchStatus = {
    WAIT: 'waiting',
    RUNNING: 'running',
    Terminate: 'terminate',
    COMPLETE: 'completed',
    // undefined is used when client first generate branch Record(But not push to Server)
    UNDEFINED: 'undefined',
};
exports.CytusService = {
    // Access Cetus_Logging process
    LOGGING: 'logging',
    // manage means : add,remove,retrieve,modify
    MANAGEMENT: 'management',
    // Access Cetus_scheduler
    SCHEDULER: 'scheduler'
};
exports.ShcedulerMethod = {
    PUSH: 'push',
    RETRIEVE: 'retrieve',
    REMOVE: 'remove',
    RESCHEDULE: 'Reschedule',
    LISTALL: 'listall'
};
exports.UserCredit = {
    BRASS: 0,
    SILVER: 1,
    GOLD: 2,
    DIAMOND: 3,
    PRIORITY: 4
};
//# sourceMappingURL=cetus_SystemConstant.js.map