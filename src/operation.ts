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