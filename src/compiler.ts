import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import * as op from './operation'

export type FunctionTable = { [name: string]: op.Operation[] }

export class Compiler implements ASTVisitor<void> {
  private labelCounter = 0

  private functions: FunctionTable = { '$main': [] }
  private currentFunctionName: string = '$main'

  constructor() {
  }

  compile(ast: AST.ASTNode[]): FunctionTable {
    ast.forEach((stmt) => {
      stmt.accept(this)
    })
    return this.functions
  }

  addOperation(op: op.Operation): void {
    this.functions[this.currentFunctionName].push(op)
  }

  visitDefineVariable(node: AST.DefineVariable): void {
    // TODO: 変数名を登録する
    node.initialValue.accept(this)
    this.addOperation(new op.Store(node.name))
  }
  visitReturnStatement(node: AST.ReturnStatement): void {
    node.value.accept(this)
    this.addOperation(new op.Ret())
  }
  visitForStatement(node: AST.ForStatement): void {
    node.init.accept(this)

    const headLabel = this.createLabel()
    const tailLabel = this.createLabel()

    this.addOperation(headLabel)

    node.condition.accept(this)
    this.addOperation(new op.JumpUnless(tailLabel.id))

    node.block.accept(this)
    node.update.accept(this)
    this.addOperation(new op.Jump(headLabel.id))

    this.addOperation(tailLabel)
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): void {
    const prevName = this.currentFunctionName
    this.currentFunctionName = node.name.value
    this.functions[this.currentFunctionName] = []

    node.args.forEach((arg) => {
      this.addOperation(new op.Store(arg.name))
    })
    node.body.accept(this)

    this.currentFunctionName = prevName
  }
  visitAssign(node: AST.Assign): void {
    node.right.accept(this)
    if (node.left.index !== null) {
      node.left.index.accept(this)
      this.addOperation(new op.StoreWithIndex(node.left.name))
    } else {
      this.addOperation(new op.Store(node.left.name))
    }
  }
  visitBinaryOp(node: AST.BinaryOp): void {
    node.left.accept(this)
    node.right.accept(this)
    if (op.isArithmeticOperation(node.op)) {
      this.addOperation(new op.IArith(node.op as op.ArithmeticOperation))
    } else {
      this.addOperation(new op.ICmp(node.op as op.PredicationalOperation))
    }
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): void {
    throw new Error("Method not implemented.");
  }
  visitCallFunction(node: AST.CallFunction): void {
    node.args.forEach((arg) => arg.accept(this))
    this.addOperation(new op.CallFunction(node.name.value, node.args.length))
  }
  visitReferenceVariable(node: AST.ReferenceVariable): void {
    if (node.index !== null) {
      node.index.accept(this)
      this.addOperation(new op.LoadWithIndex(node.name))
    } else {
      this.addOperation(new op.Load(node.name))
    }
  }
  visitIfExpression(node: AST.IfExpression): void {
    node.condition.accept(this)

    const elseLabel = this.createLabel()
    const endLabel  = this.createLabel()

    this.addOperation(new op.JumpUnless(elseLabel.id))

    // then
    node.thenBlock.accept(this)
    this.addOperation(new op.Jump(endLabel.id))

    // else
    this.addOperation(elseLabel)
    node.elseBlock.accept(this)

    this.addOperation(endLabel)
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitStringLiteral(node: AST.StringLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitArrayLiteral(node: AST.ArrayLiteral): void {
    node.values.forEach((value) => value.accept(this))
    this.addOperation(new op.CallFunction('buildArray', node.values.length))
  }
  visitBlock(node: AST.Block): void {
    node.statemetns.forEach((stmt) => stmt.accept(this))
  }
  visitIdentifier(node: AST.Identifier): void {
    throw new Error("Method not implemented.");
  }

  private createLabel() {
    return new op.Label(this.labelCounter++)
  }
}