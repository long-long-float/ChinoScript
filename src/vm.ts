import * as op from './operation'
import * as Value from './value'
import { FunctionTable, DefaultFunName } from './compiler'
import { Stack } from './stack'
import { valueToString } from './index'
import { Environment } from './environment'

import * as util from 'util'

export class VirtualMachine {
  private stack = new Stack<Value.Value>()
  private variableEnv = new Environment<Value.Value>()
  private globalVariableEnv: Value.Value[] = []

  private functions: FunctionTable

  // for JumpXXX
  private labelTable: { [id: number]: number } = {}

  private pcStack = new Stack<[number, string]>()

  private table: any

  constructor() {
    this.table = {
      CallFunction: (operation: op.CallFunction) => {
        if (operation.name === 'puts') {
          const value = this.stack.pop()
          console.log(valueToString(value))
        } else if (operation.name === 'buildArray') {
          const len = operation.argumentsLength
          const values: Value.Value[] = []
          for (let i = 0; i < len; i++) {
            values.push(this.stack.pop())
          }
          this.stack.push(new Value.ChinoArray(values.reverse(), len))

        // TODO: 下の関数を外から定義できるようにする
        } else if (operation.name === 'ctoi') {
          // do nothing
        } else if (operation.name === 'len') {
          const arg = this.stack.pop()
          if (!(arg instanceof Value.ChinoArray)) {
            throw new Error('value must be array')
          }
          const t = arg as Value.ChinoArray
          this.stack.push(t.length)
        } else if (operation.name === 'append') {
          const value = this.stack.pop()
          const arg = this.stack.pop()
          if (!(arg instanceof Value.ChinoArray)) {
            throw new Error('value must be array')
          }
          const t = arg as Value.ChinoArray
          t.values.push(value)
          t.length++

        } else {
          if (!this.functions.hasOwnProperty(operation.name)) {
            throw new Error(`unknown function ${operation.name}`)
          }
          this.variableEnv.push()
          // 命令実行後にpcがインクリメントされてしまうので-1
          this.pcStack.push([-1, operation.name])
        }
      },
      Push: (operation: op.Push) => {
        this.stack.push(operation.value)
      },
      Store: (operation: op.Store) => {
        const value = this.stack.pop()
        if (operation.global) {
          this.globalVariableEnv[operation.id] = value
        } else {
          this.variableEnv.store(operation.id.toString(), value)
        }
      },
      StoreWithIndex: (operation: op.StoreWithIndex) => {
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
      Load: (operation: op.Load) => {
        const value = operation.global ?
          this.globalVariableEnv[operation.id] :
          this.variableEnv.reference(operation.id.toString())
        if (value !== null) {
          this.stack.push(value)
        }
      },
      LoadWithIndex: (operation: op.LoadWithIndex) => {
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
      IArith: (operation: op.IArith) => {
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
      ICmp: (operation: op.ICmp) => {
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
      Jump: (operation: op.Jump) => {
        this.pcStack.top()[0] = this.labelTable[operation.destination]
      },
      JumpIf: (operation: op.JumpIf) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond === true) {
          this.pcStack.top()[0] = this.labelTable[operation.destination]
        }
      },
      JumpUnless: (operation: op.JumpUnless) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond !== true) {
          this.pcStack.top()[0] = this.labelTable[operation.destination]
        }
      },
      Ret: (operation: op.Ret) => {
        this.variableEnv.pop()
        this.pcStack.pop()
      },
      Label: (operation: op.Label) => {},
    }
  }

  run(_functions: FunctionTable): Value.Value {
    this.functions = _functions

    this.labelTable = {}
    Object.keys(this.functions).forEach((funName) => {
      this.functions[funName].forEach((operation, i) => {
        if (operation instanceof op.Label) {
          this.labelTable[operation.id] = i
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

      const f = this.table[operation.constructor.name]
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