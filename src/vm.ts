import * as op from './operation'
import * as Value from './value'

export class VirtualMachine {
  private stack: Value.Value[] = []

  run(operations: op.Operation[]) {
    operations.forEach((operation) => {
      if (operation instanceof op.CallFunction) {
        const value = this.stack.pop()
        console.log(value)
      } else if (operation instanceof op.Push) {
        this.stack.push(operation.value)
      } else {
        throw new Error(`unknown operation ${operation.constructor.name}`)
      }
    })
  }
}