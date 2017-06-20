import * as op from './operation'
import * as Value from './value'
import { FunctionTable } from './compiler'

type Environment = { [name: string]: Value.Value }

export class VirtualMachine {
  private stack: Value.Value[] = []
  private env: Environment = {}

  // for JumpXXX
  private labelTable: { [id: number]: number } = {}

  private pcStack: [number, string][] = []

  private table: any

  constructor() {
    this.table = {
      CallFunction: (operation: op.CallFunction) => {
        if (operation.name.value === 'puts') {
          const value = this.stack.pop()
          console.log(value)
        } else {
          this.pcStack.push([0, operation.name.value])
        }
      },
      Push: (operation: op.Push) => {
        this.stack.push(operation.value)
      },
      Store: (operation: op.Store) => {
        const value = this.stack.pop()
        this.env[operation.id.value] = value
      },
      Load: (operation: op.Load) => {
        this.stack.push(this.env[operation.id.value])
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
        this.topOfPCStack()[0] = this.labelTable[operation.destination]
      },
      JumpUnless: (operation: op.JumpUnless) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond !== true) {
          this.topOfPCStack()[0] = this.labelTable[operation.destination]
        }
      },
      Ret: (operation: op.Ret) => {
        this.pcStack.pop()
      },
      Label: (operation: op.Label) => {},
    }
  }

  topOfStack(): Value.Value {
    return this.stack[this.stack.length - 1]
  }

  topOfPCStack(): [number, string] {
    return this.pcStack[this.pcStack.length - 1]
  }

  run(functions: FunctionTable) {
    this.labelTable = {}
    Object.keys(functions).forEach((funName) => {
      functions[funName].forEach((operation, i) => {
        if (operation instanceof op.Label) {
          this.labelTable[operation.id] = i
        }
      })
    })

    this.pcStack.push([0, '$main'])
    while (true) {
      const pc = this.topOfPCStack()
      if (pc[0] >= functions[pc[1]].length) {
        break
      }
      const operation = functions[pc[1]][pc[0]]

      const f = this.table[operation.constructor.name]
      if (f === undefined) {
        throw new Error(`unknown operation ${operation.constructor.name}`)
      } else {
        console.log(`${pc[0]}@${pc[1]} ${operation.constructor.name}`)
        f(operation)
      }

      pc[0]++
    }
  }
}