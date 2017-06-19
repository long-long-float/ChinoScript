import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import * as op from './operation'

export class Compiler implements ASTVisitor<void> {
  private _operations: op.Operation[] = []

  constructor() {
  }

  get operations(): op.Operation[] {
    return this._operations
  }

  addOperation(op: op.Operation): void {
    this._operations.push(op)
  }

  visitDefineVariable(node: AST.DefineVariable): void {
    // TODO: 変数名を登録する
    node.initialValue.accept(this)
    this.addOperation(new op.Store(node.name))
  }
  visitAssign(node: AST.Assign): void {
    // TODO: node.left.indexに対応
    node.right.accept(this)
    this.addOperation(new op.Store(node.left.name))
  }
  visitBinaryOp(node: AST.BinaryOp): void {
    node.left.accept(this)
    node.right.accept(this)
    this.addOperation(new op.IArith(node.op as op.ArithmeticOperation))
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): void {
    throw new Error("Method not implemented.");
  }
  visitCallFunction(node: AST.CallFunction): void {
    node.args.forEach((arg) => arg.accept(this))
    this.addOperation(new op.CallFunction(node.name, node.args.length))
  }
  visitReferenceVariable(node: AST.ReferenceVariable): void {
    this.addOperation(new op.Load(node.name))
  }
  visitIfExpression(node: AST.IfExpression): void {
    throw new Error("Method not implemented.");
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitStringLiteral(node: AST.StringLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitBlock(node: AST.Block): void {
    throw new Error("Method not implemented.");
  }
  visitIdentifier(node: AST.Identifier): void {
    throw new Error("Method not implemented.");
  }
}