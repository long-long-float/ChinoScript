import * as parser from '../src/parser.js'
import * as AST from '../src/ast'

export function parse(code: string): AST.ASTNode {
  return parser.parser.parse(code)
}
