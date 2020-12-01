export const CytusAppStatus = {
    WAIT : 'waiting',
    PENDING : 'pending',
    RUNNING : 'running',
    COMPLETE : 'completed',
    Terminate: 'terminate',
    // undefined is used when client first generate branch Record(But not push to Server)
    UNDEFINED : 'undefined',
}

export const CytusBatchStatus = {
    WAIT: 'waiting',
    RUNNING : 'running',
    Terminate: 'terminate',
    COMPLETE : 'completed',
    // undefined is used when client first generate branch Record(But not push to Server)
    UNDEFINED : 'undefined',
}

export const CytusService = {
    // Access Cetus_Logging process
    LOGGING : 'logging',
    // manage means : add,remove,retrieve,modify
    MANAGEMENT : 'management',
    // Access Cetus_scheduler
    SCHEDULER : 'scheduler'
}

export const ShcedulerMethod = {
    PUSH : 'push',
    RETRIEVE : 'retrieve',
    REMOVE : 'remove',
    RESCHEDULE : 'Reschedule',
    LISTALL: 'listall'
}


export const UserCredit = {
    BRASS: 0,
    SILVER: 1,
    GOLD: 2,
    DIAMOND: 3,
    PRIORITY: 4
}