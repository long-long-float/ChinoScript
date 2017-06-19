import * as parser from './parser.js'
import * as AST from './ast'
import { Compiler } from './compiler'
import * as op from './operation'
import { VirtualMachine } from "./vm"
import * as Value from './value'

import * as util from 'util'

export function evaluate(code: string, debug = false): Value.Value {
  const ast = parse(code)
  const ops = compile(ast)

  if (debug) {
    console.log(util.inspect(ops, false, null))
    console.log(util.inspect(ast, false, null))
  }

  return run(ops)
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

export function run(operations: op.Operation[]): Value.Value {
  const vm = new VirtualMachine()
  vm.run(operations)
  return vm.topOfStack()
}