import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import { Type } from './type'
import { TypeError, SyntaxError, UndefinedError } from './exception'
import { Stack } from './stack'
import { parser } from './parser'
import { Environment } from './environment'
import { ExternalFunction } from './index'

export type DataConstrutorTable = { [name: string]: [AST.DataMemberDefinition, string] }

export class TypeChecker implements ASTVisitor<Type> {
  variableEnv = new Environment<Type>()

  currentFunctionName = ''
  functions: { [name: string]: AST.FunctionDefinition } = {}
  dataConstructors: DataConstrutorTable = {}

  externalFunctions: { [name: string]: ExternalFunction } = {}

  check(ast: AST.ASTNode[], externalFunctions: ExternalFunction[]) {
    externalFunctions.forEach((ext) => {
      this.externalFunctions[ext.name] = ext
    })

    this.variableEnv.push()
    ast.forEach((stmt) => {
      if (stmt instanceof AST.FunctionDefinition) {
        this.functions[stmt.name.value] = stmt
      } else if (stmt instanceof AST.DataDefinition) {
        stmt.members.forEach((member) => {
          this.dataConstructors[member.name.value] = [member, stmt.name.value]
        })
      }
    })

    ast.forEach((stmt) => stmt.accept(this))
  }

  visitDefineVariable(node: AST.DefineVariable): Type {
    const initType = node.initialValue.accept(this)
    const variableType = node.usingTypeInference() ? initType : node.type

    const name = node.name.value
    if (!this.variableEnv.define(name, variableType)) {
      throw new SyntaxError(`${name} has already defined`, node.name.location)
    }

    if (!node.usingTypeInference()) {
      this.checkSatisfied(variableType, initType, node.location)
    }

    return new Type('Tuple', [])
  }
  visitReturnStatement(node: AST.ReturnStatement): Type {
    const retType = node.value !== null ? node.value.accept(this) : new Type('Tuple', [])
    this.checkSatisfied(this.functions[this.currentFunctionName].outputType, retType, node.location)
    return new Type('Tuple', [])
  }
  visitYieldStatement(node: AST.YieldStatement): Type {
    const retType = node.value !== null ? node.value.accept(this) : new Type('Tuple', [])
    this.checkSatisfied(
      this.functions[this.currentFunctionName].outputType,
      new Type('Generator', [retType]),
      node.location)
    return new Type('Tuple', [])
  }
  visitBreakStatement(node: AST.BreakStatement): Type {
    // TODO: ループ内でしか使えないようにチェック
    return new Type('Tuple', [])
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): Type {
    if (!node.isGenerics()) { // non generics function
      this.defineFunction(node, null)
    } else { // gengerics function
      // do nothing
    }

    return new Type('Tuple', [])
  }
  visitDataDefinition(node: AST.DataDefinition): Type {
    // TODO: Check
    return new Type('Tuple', [])
  }
  visitForStatement(node: AST.ForStatement): Type {
    node.init.accept(this)

    const conditionType = node.condition.accept(this)
    this.checkSatisfied(new Type('Boolean', []), conditionType, node.condition.location)

    node.update.accept(this)

    node.block.accept(this)

    return new Type('Tuple', [])
  }
  visitWhileStatement(node: AST.WhileStatement): Type {
    const conditionType = node.condition.accept(this)
    this.checkSatisfied(new Type('Boolean', []), conditionType, node.condition.location)

    node.block.accept(this)

    return new Type('Tuple', [])
  }
  visitAssign(node: AST.Assign): Type {
    const leftType = this.variableEnv.reference(node.left.name.value)
    const rightType = node.right.accept(this)

    if(leftType === null) {
      throw new UndefinedError(node.left.name.value, node.location)
    }

    if (node.left.index !== null) {
      this.checkSatisfied(new Type('Array', []), leftType, node.left.location, true)
      this.checkSatisfied(leftType.innerTypes[0], rightType, node.right.location)
    } else {
      this.checkSatisfied(leftType, rightType, node.right.location)
    }
    return new Type('Tuple', [])
  }
  visitBinaryOp(node: AST.BinaryOp): Type {
    const leftType = node.left.accept(this)
    const rightType = node.right.accept(this)

    this.checkEquals(leftType, rightType, node.location)

    let expectedType: Type | null = null
    if (node.type === AST.BinaryOpType.Logic) {
      expectedType = new Type('Boolean', [])
    } else {
      if (node.op === '==' || node.op === '!=') {
        expectedType = rightType
      }
    }

    if (expectedType !== null) {
      this.checkSatisfied(expectedType, leftType, node.location)
    } else { // logic or pred
      if (!leftType.equals(new Type('Integer', [])) && !leftType.equals(new Type('Float', []))) {
        throw new TypeError(`expected 'Integer' or 'Float', but '${leftType.toString()}' given`, node.location)
      }
    }

    let resultType: Type
    if (node.type === AST.BinaryOpType.Arith) {
      resultType = leftType
    } else {
      resultType = new Type('Boolean', [])
    }

    node.left.setResultType(leftType)
    node.right.setResultType(rightType)

    return resultType
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): Type {
    throw new Error("Method not implemented.");
  }
  visitIfIsExpression(node: AST.IfIsExpression): Type {
    node.condLeft.accept(this)

    const table: { [name:string]: Type } = {}
    node.condRight.collectVariables(table, this.dataConstructors)

    // TODO: type check

    this.variableEnv.push(table)
    const thenType = node.thenBlock.accept(this)
    this.variableEnv.pop()

    if (node.elseBlock !== null) {
      const elseType = node.elseBlock.accept(this)
      this.checkEquals(thenType, elseType, node.thenBlock.location)
    } else {
      if (!thenType.equals(new Type('Tuple', []))) {
        throw new SyntaxError('else block must be needed when then block doesn\'t return unit.', node.location)
      }
    }

    return thenType
  }
  visitCallFunction(node: AST.CallFunction): Type {
    if (this.externalFunctions.hasOwnProperty(node.name.value)) {
      const target = this.externalFunctions[node.name.value]
      if (target.argTypes.length !== node.args.length) {
        throw new TypeError(`wrong number of arguments (given ${node.args.length}, expected ${target.argTypes.length})`, node.location)
      }

      const genericsTable: { [name: string]: Type } = {}
      target.argTypes.forEach((expected, i) => {
        const arg = node.args[i].accept(this)

        if (target.genericsTypes.length > 0 && target.genericsTypes.some((n) => expected.includes(n))) {
          const genericsName = expected.name
          if (!genericsTable.hasOwnProperty(genericsName)) {
            genericsTable[genericsName] = arg
          }

          this.checkSatisfied(genericsTable[genericsName], arg, node.args[i].location)
        } else {
          this.checkSatisfied(expected, arg, node.args[i].location)
        }
      })

      return target.outputType

    } else if (node.name.value === 'next') {
      const arg = node.args[0].accept(this)
      this.checkSatisfied(new Type('Generator', []), arg, node.args[0].location, true)
      return arg.innerTypes[0]

    } else if (this.functions.hasOwnProperty(node.name.value)) {
      const target = this.functions[node.name.value]
      if (target.args.length !== node.args.length) {
        throw new TypeError(`wrong number of arguments (given ${node.args.length}, expected ${target.args.length})`, node.location)
      }

      const genericsTable: { [name: string]: Type } = {}
      target.args.forEach((expected, i) => {
        const arg = node.args[i].accept(this)

        if (target.isGenerics() && target.genericTypes.some((n) => expected.type.includes(n.value))) {
          const genericsName = expected.type.name
          if (!genericsTable.hasOwnProperty(genericsName)) {
            genericsTable[genericsName] = arg
          }

          this.checkSatisfied(genericsTable[genericsName], arg, node.args[i].location)
        } else {
          this.checkSatisfied(expected.type, arg, node.args[i].location)
        }
      })

      if (target.isGenerics()) {
        this.defineFunction(target, genericsTable)
      }

      return target.outputType
    } else if (this.dataConstructors.hasOwnProperty(node.name.value)) {
      const target = this.dataConstructors[node.name.value]

      if (target[0].args.length !== node.args.length) {
        throw new TypeError(`wrong number of arguments (given ${node.args.length}, expected ${target[0].args.length})`, node.location)
      }

      target[0].args.forEach((expected, i) => {
        const arg = node.args[i].accept(this)
        this.checkSatisfied(expected.type, arg, node.args[i].location)
      })

      return new Type(target[1], [])
    } else {
      throw new SyntaxError(`${node.name.value} is not defined`, node.location)
    }
  }
  visitReferenceVariable(node: AST.ReferenceVariable): Type {
    const name = node.name.value

    const type = this.variableEnv.reference(name)
    if (type === null) {
      throw new UndefinedError(name, node.location)
    }

    if (node.index !== null) {
      this.checkSatisfied(new Type('Array', []), type, node.location, true)
      node.index.accept(this)
      return type.innerTypes[0]
    } else {
      return type
    }
  }
  visitIfExpression(node: AST.IfExpression): Type {
    const condType = node.condition.accept(this)
    this.checkSatisfied(new Type('Boolean', []), condType, node.condition.location)

    const thenType = node.thenBlock.accept(this)

    if (node.elseBlock !== null) {
      const elseType = node.elseBlock.accept(this)
      this.checkEquals(thenType, elseType, node.thenBlock.location)
    } else {
      if (!thenType.equals(new Type('Tuple', []))) {
        throw new SyntaxError('else block must be needed when then block doesn\'t return unit.', node.location)
      }
    }

    return thenType
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): Type {
    return new Type('Integer', [])
  }
  visitFloatLiteral(node: AST.IntegerLiteral): Type {
    return new Type('Float', [])
  }
  visitBooleanLiteral(node: AST.BooleanLiteral): Type {
    return new Type('Boolean', [])
  }
  visitCharLiteral(node: AST.CharLiteral): Type {
    return new Type('Char', [])
  }
  visitArrayLiteral(node: AST.ArrayLiteral): Type {
    node.values.forEach((value) => {
      this.checkSatisfied(node.type.innerTypes[0], value.accept(this), value.location)
    })
    return node.type
  }
  visitBlock(node: AST.Block): Type {
    this.variableEnv.push()
    const types = node.statemetns.map((stmt) => stmt.accept(this))
    this.variableEnv.pop()

    return types[types.length - 1]
  }
  visitIdentifier(node: AST.Identifier): Type {
    throw new Error("Method not implemented.");
  }

  private defineFunction(node: AST.FunctionDefinition, genericsTable: { [name: string]: Type } | null) {
    this.variableEnv.push()

    node.args.forEach((arg) => {
      const argType = genericsTable !== null ? genericsTable[arg.type.name] : arg.type
      this.variableEnv.define(arg.name.value, argType)
    })

    const prevName = this.currentFunctionName
    this.currentFunctionName = node.name.value

    // TODO: returnするパスがあるかどうかチェック
    node.body.accept(this)

    this.currentFunctionName = prevName

    this.variableEnv.pop()
  }

  private checkSatisfied(expected: Type, actual: Type, location: parser.Location, shallow = false) {
    const equal = shallow ? expected.name === actual.name : expected.equals(actual)
    if (!equal) {
      throw TypeError.fromTypes(expected, actual, location)
    }
  }

  private checkEquals(x: Type, y: Type, location: parser.Location) {
    if (!x.equals(y)) {
      throw new TypeError(`type mismatch (${x.name} and ${y.name})`, location)
    }
  }

}