import * as AST from './ast'
import * as Value from './value'

export class Operation {
  public opId: number
}

export class CallFunction extends Operation {
  constructor(
    public name: string,
    public argumentsLength: number
  ) {
    super()
  }
}

export class InitGenerator extends Operation {
  constructor(
    public name: string,
    public argumentsLength: number
  ) {
    super()
  }
}

export class InitData extends Operation {
  constructor(
    public name: string,
    public argumentsLength: number
  ) {
    super()
  }
}

export class Push extends Operation {
  constructor(
    public value: Value.Primitive
  ) {
    super()
  }
}

export class Store extends Operation {
  constructor(
    public id: number,
    public global: boolean
  ) {
    super()
  }
}

export class StoreWithIndex extends Operation {
  constructor(
    public id: number,
    public global: boolean
  ) {
    super()
  }
}

export class Load extends Operation {
  constructor(
    public id: number,
    public global: boolean
  ) {
    super()
  }
}

export class LoadWithIndex extends Operation {
  constructor(
    public id: number,
    public global: boolean
  ) {
    super()
  }
}

export type ArithmeticOperation = '+' | '-' | '*' | '/' | '%'
export type PredicationalOperation = '<=' | '>=' | '<' | '>' | '==' | '!='
export type LogicalOperation = '||' | '&&'

export function isArithmeticOperation(op: string): op is ArithmeticOperation {
  return op === '+' || op === '-' || op === '*' || op === '/' || op === '%'
}

export function isLogicalOperation(op: string): op is LogicalOperation {
  return op === '||' || op === '&&'
}

export class IArith extends Operation {
  constructor(
    public operation: ArithmeticOperation
  ) {
    super()
  }
}

export class FArith extends Operation {
  constructor(
    public operation: ArithmeticOperation
  ) {
    super()
  }
}

export class ICmp extends Operation {
  constructor(
    public operation: PredicationalOperation
  ) {
    super()
  }
}

export class Jump extends Operation {
  constructor(
    public destination: number
  ) {
    super()
  }
}

export class JumpIf extends Operation {
  constructor(
    public destination: number
  ) {
    super()
  }
}

export class JumpUnless extends Operation {
  constructor(
    public destination: number
  ) {
    super()
  }
}

export class Ret extends Operation {
  constructor() {
    super()
  }
}

export class YieldRet extends Operation {
  constructor() {
    super()
  }
}

export class Label extends Operation {
  constructor(
    public id: number
  ) {
    super()
  }
}