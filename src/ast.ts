import { Type } from './types'
import { parser } from './parser.d'
import { ASTVisitor } from './ast-visitor'

export abstract class ASTNode {
  constructor(
    public location: parser.Location
  ) {}

  abstract accept<T>(visitor: ASTVisitor<T>): T
}

export abstract class Statement extends ASTNode {
  constructor(
    location: parser.Location
  ) {
    super(location)
  }

  abstract accept<T>(visitor: ASTVisitor<T>): T
}

export class DefineVariable extends Statement {
  constructor(
    public isEternal: boolean,
    public type: Type,
    public name: Identifier,
    public length: IntegerLiteral | null,
    public initialValue: Expression,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitDefineVariable(this)
  }
}

export abstract class Expression extends ASTNode {
  constructor(
    location: parser.Location
  ) {
    super(location)
  }

  abstract accept<T>(visitor: ASTVisitor<T>): T
}

export class LHExpression extends ASTNode {
  constructor(
    public name: Identifier,
    public index: Expression,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T | null {
    return null
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

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitBinaryOp(this)
  }
}

export class Assign extends Expression {
  constructor(
    public left: LHExpression,
    public right: Expression,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitAssign(this)
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

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitUnaryOpFront(this)
  }
}

export class CallFunction extends Expression {
  constructor(
    public name: Identifier,
    public args: Expression[]
  ) {
    super(name.location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitCallFunction(this)
  }
}

export class ReferenceVariable extends Expression {
  constructor(
    public name: Identifier,
    public index: Expression | null
  ) {
    super(name.location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitReferenceVariable(this)
  }
}

export class IntegerLiteral extends Expression {
  constructor(
    public value: number,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitIntegerLiteral(this)
  }
}

export class Identifier extends ASTNode {
  constructor(
    public value: string,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitIdentifier(this)
  }
}