"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testMemoryPositive = exports.countMemory = void 0;
const kibiBase = {
    ki: 1,
    mi: 1024,
    gi: 1024 * 1024
};
const findOperandPair = /(\d*)([a-z]*)/i;
function countMemory(method, op1, op2) {
    let opInfo_1 = parseOperand(op1);
    let opInfo_2 = parseOperand(op2);
    if (method == 'sub') {
        let result = convertTokibiBase(opInfo_1) - convertTokibiBase(opInfo_2);
        return `${result}ki`;
    }
    else if (method == 'add') {
        let result = convertTokibiBase(opInfo_1) + convertTokibiBase(opInfo_2);
        return `${result}ki`;
    }
}
exports.countMemory = countMemory;
function parseOperand(operandString) {
    let pair = operandString.toLowerCase().match(findOperandPair);
    return {
        value: pair[1],
        unit: pair[2]
    };
}
function testMemoryPositive(operandString) {
    let pair = operandString.toLowerCase().match(findOperandPair);
    if (Number.parseInt(pair[1], 10) >= 0) {
        return true;
    }
    return false;
}
exports.testMemoryPositive = testMemoryPositive;
function convertTokibiBase(operand) {
    let base = kibiBase[operand.unit];
    console.log({ convertTokibiBase: {
            value: operand.value,
            base: base
        } });
    return Number.parseInt(operand.value, 10) * base;
}
function noname() {
}
//# sourceMappingURL=UnitCoversion.js.map