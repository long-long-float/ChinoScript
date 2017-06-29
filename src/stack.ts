export class Stack<T> {
  private _values: T[] = []

  get values() { return this._values.slice() }

  push(value: T): void {
    this._values.push(value)
  }

  pop(): T {
    const result = this._values.pop()
    if (result === undefined) {
      throw new Error('stack is empty')
    }
    return result
  }

  top(): T {
    return this._values[this._values.length - 1]
  }

  bottom(): T {
    return this._values[0]
  }
}