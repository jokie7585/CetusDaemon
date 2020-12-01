"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.administratorRouter = void 0;
const express_1 = __importDefault(require("express"));
var administratorRouter;
(function (administratorRouter) {
    administratorRouter.router = express_1.default.Router();
    /* GET home page. */
    administratorRouter.router.get('/', function (req, res, next) {
        res.json({ message: 'administratorRouter is running!' });
    });
})(administratorRouter = exports.administratorRouter || (exports.administratorRouter = {}));
//# sourceMappingURL=administrator.js.map