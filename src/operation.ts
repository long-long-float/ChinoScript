import * as AST from './ast'
import * as Value from './value'

export class Operation { }

export class CallFunction extends Operation {
  constructor(
    public name: AST.Identifier,
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
    public id: AST.Identifier // TODO: index: numberにする
  ) {
    super()
  }
}

export class Load extends Operation {
  constructor(
    public id: AST.Identifier // TODO: index: numberにする
  ) {
    super()
  }
}

export type ArithmeticOperation = '+' | '-' | '*' | '/' | '%'
export type PredicationalOperation = '<=' | '>=' | '<' | '>' | '==' | '!='

export function isArithmeticOperation(op: string): boolean {
  return op === '+' || op === '-' || op === '*' || op === '/' || op === '%'
}

export class IArith extends Operation {
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

export class Label extends Operation {
  constructor(
    public id: number
  ) {
    super()
  }
}