import * as op from './operation'
import * as Value from './value'

type Environment = { [name: string]: Value.Value }

export class VirtualMachine {
  private stack: Value.Value[] = []
  private env: Environment = {}

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
    }
  }

  run(operations: op.Operation[]) {
    operations.forEach((operation) => {
      const f = this.table[operation.constructor.name]
      if (f === undefined) {
        throw new Error(`unknown operation ${operation.constructor.name}`)
      } else {
        f(operation)
      }
    })
  }
}