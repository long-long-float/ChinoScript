import { Type } from './type'
import { parser } from './parser.d'
import { ASTVisitor } from './ast-visitor'
import { DataConstrutorTable } from './type-checker'

export abstract class ASTNode {
  private _resultType: Type | null = null

  constructor(
    public location: parser.Location
  ) {}

  abstract accept<T>(visitor: ASTVisitor<T>): T

  get resultType() { return this._resultType }

  setResultType(type: Type): void {
    if (type !== null) this._resultType = type
  }
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

  usingTypeInference(): boolean {
    return this.type.name === 'let'
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitDefineVariable(this)
  }
}

export class ReturnStatement extends Statement {
  constructor(
    public value: Expression | null,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitReturnStatement(this)
  }
}

export class YieldStatement extends Statement {
  constructor(
    public value: Expression | null,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitYieldStatement(this)
  }
}

export class BreakStatement extends Statement {
  constructor(
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitBreakStatement(this)
  }
}

export class ForStatement extends Statement {
  constructor(
    public init: DefineVariable | Expression,
    public condition: Expression,
    public update: Expression,
    public block: Block,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitForStatement(this)
  }
}

export class WhileStatement extends Statement {
  constructor(
    public condition: Expression,
    public block: Block,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitWhileStatement(this)
  }
}

export class FunctionDefinition extends Statement {
  constructor(
    public outputType: Type,
    public name: Identifier,
    public genericTypes: Identifier[],
    public args: ArgumentDefinition[],
    public body: Block,
    private modifier: 'gen' | null,
    location: parser.Location
  ) {
    super(location)

    if (this.modifier === 'gen') {
      this.outputType = new Type('Generator', [this.outputType])
    }
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitFunctionDefinition(this)
  }

  isGenerics(): boolean { return this.genericTypes.length > 0; }
  isGenerator(): boolean { return this.modifier === 'gen' }
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

export class DataDefinition extends ASTNode {
  constructor(
    public name: Identifier,
    public members: DataMemberDefinition[],
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitDataDefinition(this)
  }
}

export class DataMemberDefinition extends ASTNode {
  constructor(
    public name: Identifier,
    public args: ArgumentDefinition[],
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
    public index: Expression | null,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T | null {
    return null
  }
}

export enum BinaryOpType {
  Arith, Pred, Logic, Unknown
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

  get type(): BinaryOpType {
    switch (this.op) {
      case '+':
      case '-':
      case '*':
      case '/':
      case '%':
        return BinaryOpType.Arith
      case '<=':
      case '>=':
      case '<':
      case '>':
      case '==':
      case '!=':
        return BinaryOpType.Pred
      case '||':
      case '&&':
        return BinaryOpType.Logic
      default:
        return BinaryOpType.Unknown
    }
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

export class IfIsExpression extends Expression {
  constructor(
    public condLeft: Expression,
    public condRight: Pattern,
    public thenBlock: Block,
    public elseBlock: Block | null,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitIfIsExpression(this)
  }
}

export abstract class Pattern extends ASTNode {
  constructor(
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T | null {
    return null
  }

  abstract collectVariables(table: { [name:string]: Type }, dct: DataConstrutorTable): void
}

export class DataPattern extends Pattern {
  constructor(
    public name: Identifier,
    public args: Pattern[],
    location: parser.Location
  ) {
    super(location)
  }

  collectVariables(table: { [name:string]: Type }, dct: DataConstrutorTable): void {
    this.args.forEach((arg, i) => {
      if (arg instanceof IdentifierPattern) {
        const def = dct[this.name.value][0]
        table[arg.id.value] = def.args[i].type
      }
      arg.collectVariables(table, dct)
    })
  }
}

export class IdentifierPattern extends Pattern {
  constructor(
    public id: Identifier,
    location: parser.Location
  ) {
    super(location)
  }

  collectVariables(table: { [name:string]: Type }, dct: DataConstrutorTable): void {
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
    public elseBlock: Block | null,
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

export class FloatLiteral extends Expression {
  constructor(
    public value: number,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitFloatLiteral(this)
  }
}

export class BooleanLiteral extends Expression {
  constructor(
    public value: boolean,
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitBooleanLiteral(this)
  }
}

export class CharLiteral extends Expression {
  constructor(
    public value: string,
    location: parser.Location
  ) {
    super(location)

    // TODO: 1文字かチェック
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitCharLiteral(this)
  }
}

export class ArrayLiteral extends Expression {
  constructor(
    public type: Type,
    public values: Expression[],
    location: parser.Location
  ) {
    super(location)
  }

  accept<T>(visitor: ASTVisitor<T>): T {
    return visitor.visitArrayLiteral(this)
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