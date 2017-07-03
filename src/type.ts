import { Identifier } from './ast'

export class Type {
  constructor(
    public name: string,
    public innerTypes: Type[]
  ) {}

  static fromFunction(resultType: Type, argTypes: Type[]): Type {
    return new Type('Function', argTypes.concat([resultType]))
  }

  toString(): string {
    if (this.innerTypes.length === 0) {
      return this.name
    } else {
      return `${this.name}<${this.innerTypes.join(', ')}>`
    }
  }

  equals(that: Type): boolean {
    return this.name === that.name &&
           this.innerTypes.length === that.innerTypes.length &&
           this.innerTypes.every((type, i) => type.equals(that.innerTypes[i]))

  }

  includes(name: string): boolean {
    if (this.name === name) {
      return true
    } else {
      return this.innerTypes.some((type) => type.includes(name))
    }
  }
}