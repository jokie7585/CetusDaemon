import express from "express"

export namespace administratorRouter{
  export let router = express.Router();

  /* GET home page. */
  router.get('/', function(req, res, next) {
    res.json({message: 'administratorRouter is running!'})
  });
}
