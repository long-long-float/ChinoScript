import * as parser from './parser.js'
import * as AST from './ast'
import { Compiler } from './compiler'
import * as util from 'util'

export function evaluate(code: string) {
  const ast = parse(code)
  console.log(util.inspect(ast, false, null))
  compile(ast)
}

export function parse(code: string): AST.ASTNode[] {
  return parser.parser.parse(code)
}

export function compile(ast: AST.ASTNode[]): any {
  const compiler = new Compiler()
  ast.forEach((stmt) => {
    stmt.accept(compiler)
  })
}