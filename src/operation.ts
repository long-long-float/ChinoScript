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