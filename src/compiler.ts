import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import * as op from './operation'
import { Stack } from './stack'
import { Environment } from './environment'

export type FunctionTable = { [name: string]: op.Operation[] }

export const DefaultFunName = '$main'

export class Compiler implements ASTVisitor<void> {
  private labelCounter = 0

  private functions: FunctionTable = { [DefaultFunName]: [] }
  private currentFunctionName: string = DefaultFunName

  private functionDefinitions: { [name: string]: AST.FunctionDefinition } = {}
  private dataConstructors: { [name: string]: [AST.DataMemberDefinition, string] } = {}

  private variableEnv = new Environment<number>()
  private variableCounts: { [name: string]: number } = { [DefaultFunName]: 0 }

  private globalEnv = new Environment<number>()
  private globalVariableCount = 0

  private loopEndLabelStack = new Stack<op.Label>()

  constructor() {
  }

  compile(ast: AST.ASTNode[]): FunctionTable {
    ast.forEach((stmt) => {
      if (stmt instanceof AST.FunctionDefinition) {
        this.functionDefinitions[stmt.name.value] = stmt
      } else if (stmt instanceof AST.DataDefinition) {
        stmt.members.forEach((member) => {
          this.dataConstructors[member.name.value] = [member, stmt.name.value]
        })
      }
    })

    ast.forEach((stmt) => {
      stmt.accept(this)
    })
    return this.functions
  }

  addOperation(op: op.Operation): void {
    this.functions[this.currentFunctionName].push(op)
  }

  visitDefineVariable(node: AST.DefineVariable): void {
    node.initialValue.accept(this)
    if (this.currentFunctionName === DefaultFunName && this.variableEnv.count() === 1) { // global variable
      const id = this.defineGlobalVariable(node.name.value)
      this.addOperation(new op.Store(id, true))
    } else { // local variable
      const id = this.defineVariable(node.name.value)
      this.addOperation(new op.Store(id, false))
    }
  }
  visitReturnStatement(node: AST.ReturnStatement): void {
    if (node.value !== null) node.value.accept(this)
    this.addOperation(new op.Ret())
  }
  visitYieldStatement(node: AST.YieldStatement): void {
    if (node.value !== null) node.value.accept(this)
    this.addOperation(new op.YieldRet())
  }
  visitBreakStatement(node: AST.BreakStatement): void {
    const label = this.loopEndLabelStack.top()
    this.addOperation(new op.Jump(label.id))
  }
  visitForStatement(node: AST.ForStatement): void {
    node.init.accept(this)

    const headLabel = this.createLabel()
    const tailLabel = this.createLabel()

    this.addOperation(headLabel)

    node.condition.accept(this)
    this.addOperation(new op.JumpUnless(tailLabel.id))

    this.loopEndLabelStack.push(tailLabel)
    node.block.accept(this)
    this.loopEndLabelStack.pop()

    node.update.accept(this)
    this.addOperation(new op.Jump(headLabel.id))

    this.addOperation(tailLabel)
  }
  visitWhileStatement(node: AST.WhileStatement): void {
    const headLabel = this.createLabel()
    const tailLabel = this.createLabel()

    this.addOperation(headLabel)

    node.condition.accept(this)
    this.addOperation(new op.JumpUnless(tailLabel.id))

    this.loopEndLabelStack.push(tailLabel)
    node.block.accept(this)
    this.loopEndLabelStack.pop()

    this.addOperation(new op.Jump(headLabel.id))

    this.addOperation(tailLabel)
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): void {
    const prevName = this.currentFunctionName
    this.currentFunctionName = node.name.value
    this.functions[this.currentFunctionName] = []
    this.variableCounts[this.currentFunctionName] = 0

    node.args.forEach((arg) => {
      const id = this.defineVariable(arg.name.value)
      this.addOperation(new op.Store(id, false))
    })
    node.body.accept(this)

    // TODO: すでにRETがある場合は追加しないようにする
    this.addOperation(new op.Ret())

    this.currentFunctionName = prevName
  }
  visitDataDefinition(node: AST.DataDefinition): void {
    // TODO: impl
  }
  visitAssign(node: AST.Assign): void {
    node.right.accept(this)

    const name = node.left.name.value
    const [id, global] = this.varIdByName(name)

    if (node.left.index !== null) {
      node.left.index.accept(this)
      this.addOperation(new op.StoreWithIndex(id, global))
    } else {
      this.addOperation(new op.Store(id, global))
    }
  }
  visitBinaryOp(node: AST.BinaryOp): void {
    if (op.isArithmeticOperation(node.op)) {
      node.left.accept(this)
      node.right.accept(this)
      const type = node.left.resultType
      if (type !== null) {
        if (type.name === 'Integer') {
          this.addOperation(new op.IArith(node.op))
        } else { // Float
          this.addOperation(new op.FArith(node.op))
        }
      } else {
        throw new Error('Bug')
      }
    } else if (op.isLogicalOperation(node.op)) {
      const elseLabel = this.createLabel()
      const endLabel = this.createLabel()

      // A && B
      //
      // A
      // JumpUnless else
      // B
      // Jump end
      // else:
      // push false
      // end:

      node.left.accept(this)

      if (node.op === '&&') {
        this.addOperation(new op.JumpUnless(elseLabel.id))
      } else { // '||'
        this.addOperation(new op.JumpIf(elseLabel.id))
      }

      node.right.accept(this)
      this.addOperation(new op.Jump(endLabel.id))

      this.addOperation(elseLabel)
      this.addOperation(new op.Push(node.op !== '&&'))

      this.addOperation(endLabel)
    } else {
      node.left.accept(this)
      node.right.accept(this)
      this.addOperation(new op.ICmp(node.op as op.PredicationalOperation))
    }
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): void {
    throw new Error("Method not implemented.");
  }
  visitIfIsExpression(node: AST.IfIsExpression): void {
    // TODO: impl
  }
  visitCallFunction(node: AST.CallFunction): void {
    node.args.forEach((arg) => arg.accept(this))

    if (this.dataConstructors.hasOwnProperty(node.name.value)) {
      const target = this.dataConstructors[node.name.value]
      this.addOperation(new op.InitData(node.name.value, node.args.length))
    } else {
      const target = this.functionDefinitions[node.name.value]
      if (target && target.isGenerator()) {
        this.addOperation(new op.InitGenerator(node.name.value, node.args.length))
      } else {
        this.addOperation(new op.CallFunction(node.name.value, node.args.length))
      }
    }
  }
  visitReferenceVariable(node: AST.ReferenceVariable): void {
    const name = node.name.value
    const [id, global] = this.varIdByName(name)

    if (node.index !== null) {
      node.index.accept(this)
      this.addOperation(new op.LoadWithIndex(id, global))
    } else {
      this.addOperation(new op.Load(id, global))
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
    if (node.elseBlock !== null) {
      node.elseBlock.accept(this)
    }

    this.addOperation(endLabel)
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitFloatLiteral(node: AST.IntegerLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitCharLiteral(node: AST.CharLiteral): void {
    this.addOperation(new op.Push(node.value.charCodeAt(0)))
  }
  visitBooleanLiteral(node: AST.BooleanLiteral): void {
    this.addOperation(new op.Push(node.value))
  }
  visitArrayLiteral(node: AST.ArrayLiteral): void {
    node.values.forEach((value) => value.accept(this))
    this.addOperation(new op.CallFunction('buildArray', node.values.length))
  }
  visitBlock(node: AST.Block): void {
    this.variableEnv.push()
    node.statemetns.forEach((stmt) => stmt.accept(this))
    this.variableEnv.pop()
  }
  visitIdentifier(node: AST.Identifier): void {
    throw new Error("Method not implemented.");
  }

  private createLabel() {
    return new op.Label(this.labelCounter++)
  }

  private defineVariable(name: string): number {
    const id = this.variableCounts[this.currentFunctionName]
    this.variableEnv.define(name, id)
    this.variableCounts[this.currentFunctionName]++
    return id
  }

  private defineGlobalVariable(name: string): number {
    const id = this.globalVariableCount
    this.globalEnv.define(name, id)
    this.globalVariableCount++
    return id
  }

  private varIdByName(name: string): [number, boolean] {
    let id = this.variableEnv.reference(name)
    let global = false
    if (id === null) {
      id = this.globalEnv.reference(name)
      global = true
    }

    if (id === null) throw new Error('Bug')

    return [id, global]
  }
}