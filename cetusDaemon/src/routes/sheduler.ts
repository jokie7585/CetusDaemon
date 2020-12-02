import express from "express"
import {C_Request} from '../util/Type'

export namespace shedulerRouter{
  export let router = express.Router();

  // pin
  router.get('/pin', function(req: C_Request, res, next) {
    res.json(req.scheduler.pin());
  });

  router.get('/reloadWorkerList', function(req: C_Request, res, next) {
    res.json(req.scheduler.refreshWorkerList());
  });

  router.post('/dispatchEvent', function(req: C_Request, res, next) {
    res.json(req.scheduler.dispatchEvent(req.body));
  });

  router.get('/forceStart', function(req: C_Request, res, next) {
    res.json(req.scheduler.dispatchJob());
  });

}