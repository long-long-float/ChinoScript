import * as AST from './ast'

export interface ASTVisitor<T> {
  visitDefineVariable(node: AST.DefineVariable): T
  visitAssign(node: AST.Assign): T
  visitBinaryOp(node: AST.BinaryOp): T
  visitUnaryOpFront(node: AST.UnaryOpFront): T
  visitCallFunction(node: AST.CallFunction): T
  visitReferenceVariable(node: AST.ReferenceVariable): T
  visitIntegerLiteral(node: AST.IntegerLiteral): T
  visitIdentifier(node: AST.Identifier): T
}