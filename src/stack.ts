export class Stack<T> {
  values: T[] = []

  push(value: T): void {
    this.values.push(value)
  }

  pop(): T {
    const result = this.values.pop()
    if (result === undefined) {
      throw new Error('stack is empty')
    }
    return result
  }

  top(): T {
    return this.values[this.values.length - 1]
  }

  bottom(): T {
    return this.values[0]
  }
}