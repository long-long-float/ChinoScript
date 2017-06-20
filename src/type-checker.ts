import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'
import { Type } from './types'

export class TypeChecker implements ASTVisitor<Type> {
  check(ast: AST.ASTNode[]) {
    ast.forEach((stmt) => stmt.accept(this))
  }

  visitDefineVariable(node: AST.DefineVariable): Type {
    throw new Error("Method not implemented.");
  }
  visitReturnStatement(node: AST.ReturnStatement): Type {
    throw new Error("Method not implemented.");
  }
  visitFunctionDefinition(node: AST.FunctionDefinition): Type {
    throw new Error("Method not implemented.");
  }
  visitAssign(node: AST.Assign): Type {
    throw new Error("Method not implemented.");
  }
  visitBinaryOp(node: AST.BinaryOp): Type {
    throw new Error("Method not implemented.");
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): Type {
    throw new Error("Method not implemented.");
  }
  visitCallFunction(node: AST.CallFunction): Type {
    throw new Error("Method not implemented.");
  }
  visitReferenceVariable(node: AST.ReferenceVariable): Type {
    throw new Error("Method not implemented.");
  }
  visitIfExpression(node: AST.IfExpression): Type {
    throw new Error("Method not implemented.");
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): Type {
    throw new Error("Method not implemented.");
  }
  visitStringLiteral(node: AST.StringLiteral): Type {
    throw new Error("Method not implemented.");
  }
  visitBlock(node: AST.Block): Type {
    throw new Error("Method not implemented.");
  }
  visitIdentifier(node: AST.Identifier): Type {
    throw new Error("Method not implemented.");
  }

}