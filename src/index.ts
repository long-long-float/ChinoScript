import * as parser from './parser.js'
import * as AST from './ast'
import { Compiler } from './compiler'
import * as op from './operation'
import { VirtualMachine } from "./vm"

import * as util from 'util'

export function evaluate(code: string) {
  const ast = parse(code)
  console.log(util.inspect(ast, false, null))
  const ops = compile(ast)
  console.log(util.inspect(ops, false, null))
  run(ops)
}

export function parse(code: string): AST.ASTNode[] {
  return parser.parser.parse(code)
}

export function compile(ast: AST.ASTNode[]): op.Operation[] {
  const compiler = new Compiler()
  ast.forEach((stmt) => {
    stmt.accept(compiler)
  })
  return compiler.operations
}

export function run(operations: op.Operation[]) {
  const vm = new VirtualMachine()
  vm.run(operations)
}