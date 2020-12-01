"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exe = void 0;
const child_process_1 = require("child_process");
function exe(yamlPath) {
    child_process_1.spawnSync('kubectl', ['create', '-f', yamlPath]);
}
exports.exe = exe;
//# sourceMappingURL=excuteJob.js.map