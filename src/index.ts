import * as parser from './parser.js'
import * as AST from './ast'
import { Compiler, FunctionTable } from './compiler'
import { TypeChecker } from './type-checker'
import * as op from './operation'
import { VirtualMachine } from './vm'
import * as Value from './value'
import * as Exceptions from './exception'
import { Type } from './type'

import * as util from 'util'

export const exceptions = Exceptions

export interface ExternalFunction {
  name: string
  outputType: Type
  genericsTypes: string[]
  argTypes: Type[]
  body: (...args: Value.Value[]) => Value.Value | null
}

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
  const externalFunctions: ExternalFunction[] = [
    {
      name: 'ctoi',
      outputType: new Type('Integer', []),
      genericsTypes: [],
      argTypes: [new Type('Char', [])],
      body: (...args: Value.Value[]) => {
        return args[0]
      }
    },
    {
      name: 'puts',
      outputType: new Type('Tuple', []),
      genericsTypes: ['T'],
      argTypes: [new Type('T', [])],
      body: (...args: Value.Value[]) => {
        console.log(valueToString(args[0]))
        return null
      }
    },
    {
      name: 'len',
      outputType: new Type('Integer', []),
      genericsTypes: ['T'],
      argTypes: [new Type('Array', [new Type('T', [])])],
      body: (...args: Value.Value[]) => {
        const arg = args[0]
        if (!(arg instanceof Value.ChinoArray)) {
          throw new Error('value must be array')
        }
        const t = arg as Value.ChinoArray
        return t.length
      }
    },
    {
      name: 'append',
      outputType: new Type('Tuple', []),
      genericsTypes: ['T'],
      argTypes: [new Type('Array', [new Type('T', [])]), new Type('T', [])],
      body: (...args: Value.Value[]) => {
        const ary = args[0]
        const value = args[1]
        if (!(ary instanceof Value.ChinoArray)) {
          throw new Error('value must be array')
        }
        const t = ary as Value.ChinoArray
        t.values.push(value)
        t.length++
        return null
      }
    },
  ]

  const ast = parse(code)

  const typeChecker = new TypeChecker()
  typeChecker.check(ast, externalFunctions)

  const ops = compile(ast)

  if (debug) {
    console.log(util.inspect(ast, false, null))
    console.log(ops)
  }

  const vm = new VirtualMachine()
  return vm.run(ops, externalFunctions)
}

export function parse(code: string): AST.ASTNode[] {
  return parser.parser.parse(code)
}

export function compile(ast: AST.ASTNode[]): FunctionTable {
  const compiler = new Compiler()
  return compiler.compile(ast)
}
