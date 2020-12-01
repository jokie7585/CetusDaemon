import express from "express"
import {C_Request} from '../util/Type'
import {shedulerRouter} from './sheduler'

export namespace indexRouter{
  export let router = express.Router();

  router.use('/scheduler', shedulerRouter.router)

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.json({message: 'indexRouter is running!'})
  });

  router.get('/testUrlencoder', function(req: C_Request, res, next) {
    res.json(req.query);
  });

  
}
