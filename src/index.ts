import * as parser from './parser.js'
import * as AST from './ast'

export function evaluate(code: string) {
  const ast = parse(code)
}

export function parse(code: string): AST.ASTNode {
  return parser.parser.parse(code)
}
