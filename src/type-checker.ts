import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import { Type } from './type'
import { TypeError } from './exception'
import { Stack } from './stack'

export class TypeChecker implements ASTVisitor<Type> {
  varTableStack = new Stack<{ [name: string]: Type }>()
  functions: { [name: string]: AST.FunctionDefinition } = {}

  check(ast: AST.ASTNode[]) {
    this.varTableStack.push({})
    ast.forEach((stmt) => stmt.accept(this))
  }

  visitDefineVariable(node: AST.DefineVariable): Type {
    const initType = node.initialValue.accept(this)
    const variableType = node.usingTypeInference() ? initType : node.type

    // TODO: 2重に定義していないかのチェック
    this.varTableStack.top()[node.name.value] = variableType

    if (!node.usingTypeInference()) {
      this.checkSatisfied(variableType, initType)
    }

    return new Type('Tuple', [])
  }
  visitReturnStatement(node: AST.ReturnStatement): Type {
    // TODO: 関数の最後以外のreturnにも対応
    return node.value.accept(this)
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): Type {
    this.functions[node.name.value] = node

    this.varTableStack.push({})

    node.args.forEach((arg) => this.varTableStack.top()[arg.name.value] = arg.type)
    const resultType = node.body.accept(this)

    this.varTableStack.pop()

    this.checkSatisfied(node.outputType, resultType)

    return resultType
  }
  visitAssign(node: AST.Assign): Type {
    const leftType = this.varTableStack.top()[node.left.name.value]
    const rightType = node.right.accept(this)

    if (node.left.index !== null) {
      this.checkSatisfied(new Type('Array', []), leftType, true)
      this.checkSatisfied(leftType.innerTypes[0], rightType)
    } else {
      this.checkSatisfied(leftType, rightType)
    }
    return leftType
  }
  visitBinaryOp(node: AST.BinaryOp): Type {
    const leftType = node.left.accept(this)
    const rightType = node.right.accept(this)

    this.checkEquals(leftType, rightType)

    let expectedType: Type
    if (node.type === AST.BinaryOpType.Logic) {
      expectedType = new Type('Boolean', [])
    } else {
      // TODO: ==, !=はInteger以外も通すようにする
      expectedType = new Type('Integer', [])
    }
    this.checkSatisfied(expectedType, leftType)

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
      const target = this.functions[node.name.value]
      if (target.args.length !== node.args.length) {
        throw new TypeError(`wrong number of arguments (given ${node.args.length}, expected ${target.args.length})`)
      }
      target.args.forEach((arg, i) => {
        const a = node.args[i].accept(this)
        this.checkSatisfied(arg.type, a)
      })
      return target.outputType
    }
  }
  visitReferenceVariable(node: AST.ReferenceVariable): Type {
    // TODO: 存在チェック
    return this.varTableStack.top()[node.name.value]
  }
  visitIfExpression(node: AST.IfExpression): Type {
    const condType = node.condition.accept(this)
    const thenType = node.thenBlock.accept(this)
    const elseType = node.elseBlock.accept(this)

    this.checkSatisfied(new Type('Boolean', []), condType)
    this.checkEquals(thenType, elseType)

    return thenType
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): Type {
    return new Type('Integer', [])
  }
  visitStringLiteral(node: AST.StringLiteral): Type {
    return new Type('String', [])
  }
  visitArrayLiteral(node: AST.ArrayLiteral): Type {
    node.values.forEach((value) => {
      this.checkSatisfied(node.type.innerTypes[0], value.accept(this))
    })
    return node.type
  }
  visitBlock(node: AST.Block): Type {
    node.statemetns.forEach((stmt) => stmt.accept(this))
    return node.statemetns[node.statemetns.length - 1].accept(this)
  }
  visitIdentifier(node: AST.Identifier): Type {
    throw new Error("Method not implemented.");
  }

  private checkSatisfied(expected: Type, actual: Type, shallow = false) {
    const equal = shallow ? expected.name === actual.name : expected.equals(actual)
    if (!equal) {
      throw TypeError.fromTypes(expected, actual)
    }
  }

  private checkEquals(x: Type, y: Type) {
    if (!x.equals(y)) {
      throw new TypeError(`type mismatch (${x.name} and ${y.name})`)
    }
  }

}