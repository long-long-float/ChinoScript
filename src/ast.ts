import { Type } from './types'
import { parser } from './parser.d'

export class ASTNode {
  constructor(
    public location: parser.Location
  ) {}
}

export class Statement extends ASTNode {
  constructor(
    location: parser.Location
  ) {
    super(location)
  }
}

export class DefineVariable extends Statement {
  constructor(
    isEternal: boolean,
    type: Type,
    name: Identifier,
    length: IntegerLiteral | null,
    initialValue: Expression,
    location: parser.Location
  ) {
    super(location)
  }
}

export class Expression extends ASTNode {
  constructor(
    location: parser.Location
  ) {
    super(location)
  }
}

export class BinaryOp extends Expression {
  constructor(
    public left: Expression,
    public op: string,
    public right: Expression,
    location: parser.Location
  ) {
    super(location)
  }
}

export class UnaryOpFront extends Expression {
  constructor(
    public op: string,
    public right: Expression,
    location: parser.Location
  ) {
    super(location)
  }
}

export class CallFunction extends Expression {
  constructor(
    public name: Identifier,
    public args: Expression[]
  ) {
    super(name.location)
  }
}

export class ReferenceVariable extends Expression {
  constructor(
    public name: Identifier,
    public index: Expression | null
  ) {
    super(name.location)
  }
}

export class IntegerLiteral extends Expression {
  constructor(
    public value: number,
    location: parser.Location
  ) {
    super(location)
  }
}

export class Identifier extends ASTNode {
  constructor(
    public value: string,
    location: parser.Location
  ) {
    super(location)
  }
}