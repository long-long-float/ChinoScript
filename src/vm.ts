import * as op from './operation'
import * as Value from './value'
import { FunctionTable } from './compiler'
import { Stack } from './stack'

type Environment = { [name: string]: Value.Value }

export class VirtualMachine {
  private stack = new Stack<Value.Value>()
  private envStack = new Stack<Environment>()

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
          console.log(value)
        } else if (operation.name === 'buildArray') {
          const len = operation.argumentsLength
          const values: Value.Value[] = []
          for (let i = 0; i < len; i++) {
            values.push(this.stack.pop())
          }
          this.stack.push(new Value.ChinoArray(values, len))
        } else {
          if (!this.functions.hasOwnProperty(operation.name)) {
            throw new Error(`unknown function ${operation.name}`)
          }
          this.envStack.push({})
          this.pcStack.push([0, operation.name])
        }
      },
      Push: (operation: op.Push) => {
        this.stack.push(operation.value)
      },
      Store: (operation: op.Store) => {
        const value = this.stack.pop()
        this.envStack.top()[operation.id.value] = value
      },
      Load: (operation: op.Load) => {
        this.stack.push(this.envStack.top()[operation.id.value])
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
      JumpUnless: (operation: op.JumpUnless) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond !== true) {
          this.pcStack.top()[0] = this.labelTable[operation.destination]
        }
      },
      Ret: (operation: op.Ret) => {
        this.envStack.pop()
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

    this.envStack.push({})

    this.pcStack.push([0, '$main'])
    while (true) {
      const pc = this.pcStack.top()
      if (pc[0] >= this.functions[pc[1]].length) {
        break
      }
      const operation = this.functions[pc[1]][pc[0]]

      const f = this.table[operation.constructor.name]
      if (f === undefined) {
        throw new Error(`unknown operation ${operation.constructor.name}`)
      } else {
        // console.log(`${pc[0]}@${pc[1]} ${operation.constructor.name}`)
        f(operation)
      }

      pc[0]++
    }

    return this.stack.top()
  }

  private isNumber(value: Value.Value): value is number {
    return typeof value === 'number'
  }
}