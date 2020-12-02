"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shedulerRouter = void 0;
const express_1 = __importDefault(require("express"));
var shedulerRouter;
(function (shedulerRouter) {
    shedulerRouter.router = express_1.default.Router();
    // pin
    shedulerRouter.router.get('/pin', function (req, res, next) {
        res.json(req.scheduler.pin());
    });
    shedulerRouter.router.get('/reloadWorkerList', function (req, res, next) {
        res.json(req.scheduler.refreshWorkerList());
    });
    shedulerRouter.router.post('/dispatchEvent', function (req, res, next) {
        res.json(req.scheduler.dispatchEvent(req.body));
    });
    shedulerRouter.router.get('/forceStart', function (req, res, next) {
        res.json(req.scheduler.dispatchJob());
    });
})(shedulerRouter = exports.shedulerRouter || (exports.shedulerRouter = {}));
//# sourceMappingURL=sheduler.js.map