import * as AST from './ast'

export interface ASTVisitor<T> {
  visitDefineVariable(node: AST.DefineVariable): T
  visitReturnStatement(node: AST.ReturnStatement): T
  visitFunctionDefinition(node: AST.FunctionDefinition): T
  visitAssign(node: AST.Assign): T
  visitBinaryOp(node: AST.BinaryOp): T
  visitUnaryOpFront(node: AST.UnaryOpFront): T
  visitCallFunction(node: AST.CallFunction): T
  visitReferenceVariable(node: AST.ReferenceVariable): T
  visitIfExpression(node: AST.IfExpression): T
  visitIntegerLiteral(node: AST.IntegerLiteral): T
  visitStringLiteral(node: AST.StringLiteral): T
  visitBlock(node: AST.Block): T
  visitIdentifier(node: AST.Identifier): T
}