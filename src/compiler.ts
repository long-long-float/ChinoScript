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
  visitBinaryOp(node: AST.BinaryOp): void {
    throw new Error("Method not implemented.");
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
  visitIntegerLiteral(node: AST.IntegerLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitIdentifier(node: AST.Identifier): void {
    throw new Error("Method not implemented.");
  }
}