import { ASTVisitor } from './ast-visitor'
import * as AST from './ast'

export class Compiler implements ASTVisitor<void> {
  visitDefineVariable(node: AST.DefineVariable): void {
    throw new Error("Method not implemented.");
  }
  visitBinaryOp(node: AST.BinaryOp): void {
    throw new Error("Method not implemented.");
  }
  visitUnaryOpFront(node: AST.UnaryOpFront): void {
    throw new Error("Method not implemented.");
  }
  visitCallFunction(node: AST.CallFunction): void {
    throw new Error("Method not implemented.");
  }
  visitReferenceVariable(node: AST.ReferenceVariable): void {
    throw new Error("Method not implemented.");
  }
  visitIntegerLiteral(node: AST.IntegerLiteral): void {
    throw new Error("Method not implemented.");
  }
  visitIdentifier(node: AST.Identifier): void {
    throw new Error("Method not implemented.");
  }
}