import {Request} from 'express'
import {Scheduler} from '../middleware/sheduler/cetusScheduler'

export interface C_Request extends Request {
    scheduler: Scheduler,
}