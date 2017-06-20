export class Stack<T> {
  values: T[] = []

  push(value: T): void {
    this.values.push(value)
  }

  pop(): T | undefined {
    return this.values.pop()
  }

  top(): T {
    return this.values[this.values.length - 1]
  }
}