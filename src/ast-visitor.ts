import * as AST from './ast'

export interface ASTVisitor<T> {
  visitDefineVariable(node: AST.DefineVariable): T
  visitReturnStatement(node: AST.ReturnStatement): T
  visitYieldStatement(node: AST.YieldStatement): T
  visitBreakStatement(node: AST.BreakStatement): T
  visitForStatement(node: AST.ForStatement): T
  visitWhileStatement(node: AST.WhileStatement): T
  visitFunctionDefinition(node: AST.FunctionDefinition): T
  visitAssign(node: AST.Assign): T
  visitBinaryOp(node: AST.BinaryOp): T
  visitUnaryOpFront(node: AST.UnaryOpFront): T
  visitCallFunction(node: AST.CallFunction): T
  visitReferenceVariable(node: AST.ReferenceVariable): T
  visitIfExpression(node: AST.IfExpression): T
  visitIntegerLiteral(node: AST.IntegerLiteral): T
  visitBooleanLiteral(node: AST.BooleanLiteral): T
  visitCharLiteral(node: AST.CharLiteral): T
  visitArrayLiteral(node: AST.ArrayLiteral): T
  visitBlock(node: AST.Block): T
  visitIdentifier(node: AST.Identifier): T
}