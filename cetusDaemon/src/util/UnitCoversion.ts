const kibiBase: any =  {
    ki: 1,
    mi : 1024,
    gi : 1024*1024
}

interface operand {
    value: string,
    unit: string
}

const findOperandPair = /(\d*)([a-z]*)/i;

export function countMemory(method: 'add' | 'sub', op1: string, op2: string):string {
    let opInfo_1 = parseOperand(op1);
    let opInfo_2 = parseOperand(op2);

    if(method == 'sub') {
        let result = convertTokibiBase(opInfo_1) - convertTokibiBase(opInfo_2);
        return `${result}ki`
    }
    else if(method == 'add') {
        let result = convertTokibiBase(opInfo_1) + convertTokibiBase(opInfo_2);
        return `${result}ki`
    }
}

function parseOperand(operandString: string): operand{
    let pair = operandString.toLowerCase().match(findOperandPair)
    return {
        value: pair[1],
        unit: pair[2]
    } as operand
}

export function testMemoryPositive(operandString: string): boolean {
    let pair = operandString.toLowerCase().match(findOperandPair)
    if(Number.parseInt(pair[1], 10) >= 0) {
        return true
    }

    return false;
}

function convertTokibiBase(operand: operand): number {
    let base = kibiBase[operand.unit] as  number;
    console.log({convertTokibiBase:{
        value: operand.value,
        base: base
    }})
    return Number.parseInt(operand.value, 10) * base;
}

function noname() {

}