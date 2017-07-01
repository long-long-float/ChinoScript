import * as parser from './parser.js'
import * as AST from './ast'
import { Compiler, FunctionTable } from './compiler'
import { TypeChecker } from './type-checker'
import * as op from './operation'
import { VirtualMachine } from './vm'
import * as Value from './value'
import * as Exceptions from './exception'

import * as util from 'util'

export const exceptions = Exceptions

export function valueToString(value: Value.Value): string {
  if (value instanceof Value.ChinoArray) {
    return value.values.map((ch: number) => String.fromCharCode(ch)).join('')
  } else {
    return value.toString()
  }
}

export function valueToArray(value: Value.Value): Value.Value[] | undefined {
  if (value instanceof Value.ChinoArray) {
    return value.values
  } else {
    return undefined
  }
}

export function evaluate(code: string, debug = false): Value.Value {
  const ast = parse(code)

  const typeChecker = new TypeChecker()
  typeChecker.check(ast)

  const ops = compile(ast)

  if (debug) {
    console.log(util.inspect(ast, false, null))
    console.log(ops)
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