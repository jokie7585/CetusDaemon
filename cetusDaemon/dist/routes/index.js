"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.indexRouter = void 0;
const express_1 = __importDefault(require("express"));
const sheduler_1 = require("./sheduler");
var indexRouter;
(function (indexRouter) {
    indexRouter.router = express_1.default.Router();
    indexRouter.router.use('/scheduler', sheduler_1.shedulerRouter.router);
    /* GET home page. */
    indexRouter.router.get('/', function (req, res, next) {
        res.json({ message: 'indexRouter is running!' });
    });
    indexRouter.router.get('/testUrlencoder', function (req, res, next) {
        res.json(req.query);
    });
})(indexRouter = exports.indexRouter || (exports.indexRouter = {}));
//# sourceMappingURL=index.js.map