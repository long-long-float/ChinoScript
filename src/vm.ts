import * as op from './operation'
import * as Value from './value'
import { FunctionTable } from './compiler'
import { Stack } from './stack'

type Environment = { [name: string]: Value.Value }

export class VirtualMachine {
  private stack = new Stack<Value.Value>()
  private envStack = new Stack<Environment>()

  // for JumpXXX
  private labelTable: { [id: number]: number } = {}

  private pcStack = new Stack<[number, string]>()

  private table: any

  constructor() {
    this.table = {
      CallFunction: (operation: op.CallFunction) => {
        if (operation.name.value === 'puts') {
          const value = this.stack.pop()
          console.log(value)
        } else {
          this.envStack.push({})
          this.pcStack.push([0, operation.name.value])
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
        let result: Value.Value // TODO: Value.Integerにする
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
        let result: Value.Value // TODO: Value.Booleanにする
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

  run(functions: FunctionTable): Value.Value {
    this.labelTable = {}
    Object.keys(functions).forEach((funName) => {
      functions[funName].forEach((operation, i) => {
        if (operation instanceof op.Label) {
          this.labelTable[operation.id] = i
        }
      })
    })

    this.envStack.push({})

    this.pcStack.push([0, '$main'])
    while (true) {
      const pc = this.pcStack.top()
      if (pc[0] >= functions[pc[1]].length) {
        break
      }
      const operation = functions[pc[1]][pc[0]]

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
}