import * as op from './operation'
import * as Value from './value'

type Environment = { [name: string]: Value.Value }

export class VirtualMachine {
  private stack: Value.Value[] = []
  private env: Environment = {}

  // for JumpXXX
  private labelTable: { [id: number]: number } = {}

  private pc: number

  private table: any

  constructor() {
    this.table = {
      CallFunction: (operation: op.CallFunction) => {
        const value = this.stack.pop()
        console.log(value)
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
        this.pc = this.labelTable[operation.destination]
      },
      JumpUnless: (operation: op.JumpUnless) => {
        const cond = this.stack.pop()
        // TODO: condの型を決定させる
        if (cond !== true) {
          this.pc = this.labelTable[operation.destination]
        }
      },
      Label: (operation: op.Label) => {},
    }
  }

  topOfStack(): Value.Value {
    return this.stack[this.stack.length - 1]
  }

  run(operations: op.Operation[]) {
    this.labelTable = {}
    operations.forEach((operation, i) => {
      if (operation instanceof op.Label) {
        this.labelTable[operation.id] = i
      }
    })

    for (this.pc = 0; this.pc < operations.length; this.pc++) {
      const operation = operations[this.pc]

      const f = this.table[operation.constructor.name]
      if (f === undefined) {
        throw new Error(`unknown operation ${operation.constructor.name}`)
      } else {
        f(operation)
      }
    }
  }
}