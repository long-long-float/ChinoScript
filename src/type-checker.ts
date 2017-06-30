import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import { Type } from './type'
import { TypeError, SyntaxError, UndefinedError } from './exception'
import { Stack } from './stack'
import { parser } from './parser'
import { Environment } from './environment'

export class TypeChecker implements ASTVisitor<Type> {
  variableEnv = new Environment<Type>()
  functions: { [name: string]: AST.FunctionDefinition } = {}

  check(ast: AST.ASTNode[]) {
    this.variableEnv.push()
    ast.forEach((stmt) => {
      if (stmt instanceof AST.FunctionDefinition) {
        this.functions[stmt.name.value] = stmt
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
    // TODO: 関数の最後以外のreturnにも対応
    return node.value.accept(this)
  }
  visitBreakStatement(node: AST.BreakStatement): Type {
    // TODO: ループ内でしか使えないようにチェック
    return new Type('Tuple', [])
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): Type {
    this.variableEnv.push()

    node.args.forEach((arg) => this.variableEnv.define(arg.name.value, arg.type))
    const resultType = node.body.accept(this)

    this.variableEnv.pop()

    this.checkSatisfied(node.outputType, resultType, node.body.location)

    return resultType
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

    let expectedType: Type
    if (node.type === AST.BinaryOpType.Logic) {
      expectedType = new Type('Boolean', [])
    } else {
      if (node.op === '==' || node.op === '!=') {
        expectedType = rightType
      } else {
        expectedType = new Type('Integer', [])
      }
    }
    this.checkSatisfied(expectedType, leftType, node.location)

    let resultType: Type
    if (node.type === AST.BinaryOpType.Arith) {
      resultType = leftType
    } else {
      resultType = new Type('Boolean', [])
    }

    return resultType
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): Type {
    throw new Error("Method not implemented.");
  }
  visitCallFunction(node: AST.CallFunction): Type {
    if (node.name.value === 'puts') {
      // TODO: check
      node.args[0].accept(this)
      return new Type('Tuple', [])
    } else {
      if (!this.functions.hasOwnProperty(node.name.value)) {
        throw new SyntaxError(`${node.name.value} is not defined`, node.location)
      }
      const target = this.functions[node.name.value]
      if (target.args.length !== node.args.length) {
        throw new TypeError(`wrong number of arguments (given ${node.args.length}, expected ${target.args.length})`, node.location)
      }
      target.args.forEach((arg, i) => {
        const a = node.args[i].accept(this)
        this.checkSatisfied(arg.type, a, node.args[i].location)
      })
      return target.outputType
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

    if (!thenType.equals(new Type('Tuple', []))) {
      if (node.elseBlock === null) {
        throw new SyntaxError('else block must be needed when then block doesn\'t return unit.', node.location)
      }
      const elseType = node.elseBlock.accept(this)
      this.checkEquals(thenType, elseType, node.thenBlock.location)
    }

    return thenType
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): Type {
    return new Type('Integer', [])
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