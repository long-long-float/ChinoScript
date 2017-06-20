import { Type } from './type'

export class TypeError extends Error {
  constructor(
    message: string
  ) {
    super(message)
  }

  static fromTypes(expect: Type, actual: Type): TypeError {
    return new TypeError(`expected '${expect.toString()}', but '${actual.toString()}' given`)
  }

}