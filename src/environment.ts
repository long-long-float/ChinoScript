import { Stack } from './stack'

type Table<T> = { [key: string]: T }

export class Environment<T> {
  private tableStack = new Stack<Table<T>>()

  constructor() {
    this.push()
  }

  push(value: Table<T> = {}) {
    this.tableStack.push(value)
  }

  pop() {
    this.tableStack.pop()
  }

  define(name: string, value: T): boolean {
    const table = this.tableStack.top()
    if (table.hasOwnProperty(name)) {
      return false
    }

    table[name] = value

    return true
  }

  // with no checks
  store(name: string, value: T) {
    this.tableStack.top()[name] = value
  }

  reference(name: string): T | null {
    const table = this.tableStack.values.reverse().find((table) => {
      return table.hasOwnProperty(name)
    })

    if (table !== undefined) {
      return table[name]
    } else {
      return null
    }
  }

  count(): number {
    return this.tableStack.count()
  }
}