import * as parser from './parser.js'
import * as AST from './ast'
import { Compiler, FunctionTable } from './compiler'
import * as op from './operation'
import { VirtualMachine } from './vm'
import * as Value from './value'
import * as Exceptions from './exception'

import * as util from 'util'

export const exceptions = Exceptions

export function evaluate(code: string, debug = false): Value.Value {
  const ast = parse(code)
  const ops = compile(ast)

  if (debug) {
    console.log(util.inspect(ast, false, null))
    console.log(util.inspect(ops, false, null))
    Object.keys(ops).forEach((funName) => {
      console.log(funName)
      ops[funName].forEach((opr) => {
        console.log(`  ${opr.constructor.name}`)
      })
    })
  }

  return run(ops)
}

export function parse(code: string): AST.ASTNode[] {
  return parser.parser.parse(code)
}

export function compile(ast: AST.ASTNode[]): FunctionTable {
  const compiler = new Compiler()
  return compiler.compile(ast)
}

export function run(operations: FunctionTable): Value.Value {
  const vm = new VirtualMachine()
  return vm.run(operations)
}