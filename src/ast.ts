import { parser } from './parser.d'

export class ASTNode {
  constructor(
    public location: parser.Location
  ) {}
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