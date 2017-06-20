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

export class ReturnStatement extends Statement {
  constructor(
    public value: Expression
  ) {
    super(value.location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitReturnStatement(this)
  }
}

export class FunctionDefinition extends Statement {
  constructor(
    public outputType: Type,
    public name: Identifier,
    public genericTypes: Identifier[],
    public args: ArgumentDefinition[],
    public body: Block,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitFunctionDefinition(this)
  }
}

export class ArgumentDefinition extends ASTNode {
  constructor(
    public type: Type,
    public name: Identifier,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T | null {
    return null
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

export class IfExpression extends Expression {
  constructor(
    public condition: Expression,
    public thenBlock: Block,
    public elseBlock: Block,
  ) {
    super(condition.location)
  }
  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitIfExpression(this)
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

export class StringLiteral extends Expression {
  constructor(
    public value: string,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitStringLiteral(this)
  }
}

export class Block extends Statement {
  constructor(
    public statemetns: Statement[],
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitBlock(this)
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