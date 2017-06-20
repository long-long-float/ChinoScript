import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import { Type } from './type'
import { TypeError } from './exception'
import { Stack } from './stack'

export class TypeChecker implements ASTVisitor<Type> {
  varTableStack = new Stack<{ [name: string]: Type }>()

  check(ast: AST.ASTNode[]) {
    this.varTableStack.push({})
    ast.forEach((stmt) => stmt.accept(this))
  }

  visitDefineVariable(node: AST.DefineVariable): Type {
    // TODO: 2重に定義していないかのチェック
    this.varTableStack.top()[node.name.value] = node.type
    return new Type('Tuple', [])
  }
  visitReturnStatement(node: AST.ReturnStatement): Type {
    throw new Error("Method not implemented.");
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): Type {
    this.varTableStack.push({})
    throw new Error("Method not implemented.");
  }
  visitAssign(node: AST.Assign): Type {
    const leftType = this.varTableStack.top()[node.left.name.value]
    const rightType = node.right.accept(this)
    if (!leftType.equals(rightType)) {
      throw TypeError.fromTypes(leftType, rightType)
    }
    return leftType
  }
  visitBinaryOp(node: AST.BinaryOp): Type {
    const leftType = node.left.accept(this)
    const rightType = node.right.accept(this)

    if (!leftType.equals(rightType)) {
      throw new TypeError(`type mismatch (${leftType.name} and ${rightType.name})`)
    }

    let expectedType: Type
    if (node.type === AST.BinaryOpType.Logic) {
      expectedType = new Type('Boolean', [])
    } else {
      // TODO: ==, !=はInteger以外も通すようにする
      expectedType = new Type('Integer', [])
    }
    if (!expectedType.equals(leftType)) {
      throw TypeError.fromTypes(expectedType, leftType)
    }

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
    const argType = node.args[0].accept(this)
    const putsArgType = new Type('String', [])
    if (!argType.equals(putsArgType)) {
      throw TypeError.fromTypes(putsArgType, argType)
    }
    return new Type('Tuple', [])
  }
  visitReferenceVariable(node: AST.ReferenceVariable): Type {
    // TODO: 存在チェック
    return this.varTableStack.top()[node.name.value]
  }
  visitIfExpression(node: AST.IfExpression): Type {
    const condType = node.condition.accept(this)
    const thenType = node.thenBlock.accept(this)
    const elseType = node.thenBlock.accept(this)

    if (!condType.is('Boolean')) {
      throw TypeError.fromTypes(new Type('Boolean', []), condType)
    }
    if (!thenType.equals(elseType)) {
      throw new TypeError(`type mismatch (${thenType.name} and ${elseType.name})`)
    }

    return thenType
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): Type {
    return new Type('Integer', [])
  }
  visitStringLiteral(node: AST.StringLiteral): Type {
    return new Type('String', [])
  }
  visitBlock(node: AST.Block): Type {
    node.statemetns.forEach((stmt) => stmt.accept(this))
    return node.statemetns[node.statemetns.length - 1].accept(this)
  }
  visitIdentifier(node: AST.Identifier): Type {
    throw new Error("Method not implemented.");
  }

}