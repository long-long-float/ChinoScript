import * as op from './operation'
import * as Value from './value'
import { FunctionTable, DefaultFunName } from './compiler'
import { Stack } from './stack'
import { valueToString, ExternalFunction } from './index'
import { Environment } from './environment'
import { Type } from './type'
import { Pattern, DataPattern, IdentifierPattern, LiteralPattern } from './ast'

import * as util from 'util'

export class VirtualMachine {
  private stack = new Stack<Value.Value>()
  private variableEnv = new Environment<Value.Value>()
  private globalVariableEnv: Value.Value[] = []

  private functions: FunctionTable
  private externalFunctions: { [name: string]: ExternalFunction } = {}

  // for JumpXXX
  private labelTable: { [id: number]: number } = {}

  private pcStack = new Stack<[number, string]>()

  private genStack = new Stack<Value.Generator>()

  private table: any[]

  constructor() {
    this.table = [
      'CallFunction', (operation: op.CallFunction) => {
        if (operation.name === 'buildArray') {
          const len = operation.argumentsLength
          const values: Value.Value[] = []
          for (let i = 0; i < len; i++) {
            values.push(this.stack.pop())
          }
          this.stack.push(new Value.ChinoArray(values.reverse(), len))
        } else if (operation.name === 'next') {
          const gen = this.stack.pop()
          if (!(gen instanceof Value.Generator)) {
            throw new Error('value must be generator')
          }
          this.variableEnv.push(gen.variableEnv)
          this.pcStack.push([gen.pc - 1, gen.name])
          this.genStack.push(gen)

        } else if (this.externalFunctions.hasOwnProperty(operation.name)) {
          const callee = this.externalFunctions[operation.name]
          const argLen = callee.argTypes.length
          const args: Value.Value[] = []
          for (let i = 0; i < argLen; i++) {
            args.push(this.stack.pop())
          }
          const result = callee.body.apply(null, args.reverse())
          if (!callee.outputType.equals(new Type('Tuple', []))) {
            this.stack.push(result)
          }

        } else {
          if (!this.functions.hasOwnProperty(operation.name)) {
            throw new Error(`unknown function ${operation.name}`)
          }
          this.variableEnv.push()
          // 命令実行後にpcがインクリメントされてしまうので-1
          this.pcStack.push([-1, operation.name])
        }
      },
      'InitGenerator', (operation: op.InitGenerator) => {
        this.stack.push(new Value.Generator(operation.name))
      },
      'InitData', (operation: op.InitData) => {
        const argLen = operation.argumentsLength
        const args: Value.Value[] = []
        for (let i = 0; i < argLen; i++) {
          args.push(this.stack.pop())
        }
        this.stack.push(new Value.ChinoData(operation.name, args.reverse()))
      },
      'Push', (operation: op.Push) => {
        this.stack.push(operation.value)
      },
      'Store', (operation: op.Store) => {
        const value = this.stack.pop()
        if (operation.global) {
          this.globalVariableEnv[operation.id] = value
        } else {
          this.variableEnv.store(operation.id.toString(), value)
        }
      },
      'StoreWithIndex', (operation: op.StoreWithIndex) => {
        const index = this.stack.pop()
        const value = this.stack.pop()

        const target = operation.global ?
          this.globalVariableEnv[operation.id] :
          this.variableEnv.reference(operation.id.toString())

        if (!this.isNumber(index)) {
          throw new Error('right or left must be number')
        }

        if (!(target instanceof Value.ChinoArray)) {
          throw new Error('value must be array')
        }

        // ここでなぜかtargetがPrimitiveになる(バグ?)
        const t = target as Value.ChinoArray

        t.values[index] = value
      },
      'Load', (operation: op.Load) => {
        const value = operation.global ?
          this.globalVariableEnv[operation.id] :
          this.variableEnv.reference(operation.id.toString())
        if (value !== null) {
          this.stack.push(value)
        }
      },
      'LoadWithIndex', (operation: op.LoadWithIndex) => {
        const index = this.stack.pop()
        const target = operation.global ?
          this.globalVariableEnv[operation.id] :
          this.variableEnv.reference(operation.id.toString())

        if (!this.isNumber(index)) {
          throw new Error('right or left must be number')
        }

        if (!(target instanceof Value.ChinoArray)) {
          throw new Error('value must be array')
        }

        // ここでなぜかtargetがPrimitiveになる(バグ?)
        const t = target as Value.ChinoArray

        this.stack.push(t.values[index])
      },
      'IArith', (operation: op.IArith) => {
        const right = this.stack.pop()
        const left = this.stack.pop()

        if (!this.isNumber(right) || !this.isNumber(left)) {
          throw new Error('right or left must be number')
        }

        let result: Value.Integer
        switch (operation.operation) {
          case '+': result = left + right; break
          case '-': result = left - right; break
          case '*': result = left * right; break
          case '/': result = left / right; break
          case '%': result = left % right; break
          default: throw new Error(`unknown operation ${operation.operation}`)
        }
        this.stack.push(Math.floor(result))
      },
      'FArith', (operation: op.IArith) => {
        const right = this.stack.pop()
        const left = this.stack.pop()

        if (!this.isNumber(right) || !this.isNumber(left)) {
          throw new Error('right or left must be number')
        }

        let result: Value.Integer
        switch (operation.operation) {
          case '+': result = left + right; break
          case '-': result = left - right; break
          case '*': result = left * right; break
          case '/': result = left / right; break
          case '%': result = left % right; break
          default: throw new Error(`unknown operation ${operation.operation}`)
        }
        this.stack.push(result)
      },
      'ICmp', (operation: op.ICmp) => {
        const right = this.stack.pop()
        const left = this.stack.pop()
        let result: Value.Boolean
        switch (operation.operation) {
          case '<=': result = left <= right; break
          case '>=': result = left >= right; break
          case '<':  result = left < right; break
          case '>':  result = left > right; break
          case '==': result = left == right; break
          case '!=': result = left != right; break
          default: throw new Error(`unknown operation ${operation.operation}`)
        }
        this.stack.push(result)
      },
      'Jump', (operation: op.Jump) => {
        this.pcStack.top()[0] = this.labelTable[operation.destination]
      },
      'JumpIf', (operation: op.JumpIf) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond === true) {
          this.pcStack.top()[0] = this.labelTable[operation.destination]
        }
      },
      'JumpUnless', (operation: op.JumpUnless) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond !== true) {
          this.pcStack.top()[0] = this.labelTable[operation.destination]
        }
      },
      'Ret', (operation: op.Ret) => {
        this.variableEnv.pop()
        this.pcStack.pop()
      },
      'YieldRet', (operation: op.YieldRet) => {
        this.variableEnv.pop()
        const pc = this.pcStack.pop()
        const gen = this.genStack.pop()
        gen.pc = pc[0] + 1
      },
      'Match', (operation: op.Match) => {
        const target = this.stack.pop()

        const innerVars: Value.Value[] = []
        const match = (t: Value.Value, p: Pattern): boolean => {
          if (p instanceof IdentifierPattern) {
            innerVars.push(t)
            return true
          } else if (p instanceof DataPattern && t instanceof Value.ChinoData) {
            if (t.name === p.name.value) {
              return p.args.every((arg, i) =>
                match(t.values[i], arg)
              )
            } else {
              return false
            }
          } else if (p instanceof LiteralPattern) {
            // TODO: 予めコンパイルしておく
            return t === (p.literal as any).value
          } else {
            return false
          }
        }
        const result = match(target, operation.pattern)

        innerVars.forEach((v) => {
          this.stack.push(v)
        })
        this.stack.push(result)
      },
      'Label', (operation: op.Label) => {},
    ]
  }

  run(_functions: FunctionTable, externalFunctions: ExternalFunction[]): Value.Value {
    this.functions = _functions
    externalFunctions.forEach((ext) => {
      this.externalFunctions[ext.name] = ext
    })

    this.labelTable = {}
    Object.keys(this.functions).forEach((funName) => {
      this.functions[funName].forEach((operation, i) => {
        if (operation instanceof op.Label) {
          this.labelTable[operation.id] = i
        }

        operation.opId = this.table.findIndex((val) => operation.constructor.name === val) + 1
        if (operation.opId === 0) {
          throw new Error(`unknown operation ${operation.constructor.name}`)
        }
      })
    })

    this.pcStack.push([0, DefaultFunName])
    while (true) {
      let pc = this.pcStack.top()
      if (pc[0] >= this.functions[pc[1]].length) {
        break
      }
      const operation = this.functions[pc[1]][pc[0]]

      const f = this.table[operation.opId]
      if (f === undefined) {
        throw new Error(`unknown operation ${operation.constructor.name}`)
      } else {
        // console.log(`${pc[0]}@${pc[1]} ${operation.constructor.name}`, this.stack)
        f(operation)
      }

      pc = this.pcStack.top()
      pc[0]++
    }

    return this.stack.top()
  }

  private isNumber(value: Value.Value): value is number {
    return typeof value === 'number'
  }
}