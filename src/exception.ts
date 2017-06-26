import { Type } from './type'
import { parser } from './parser'

export class TypeError extends Error {
  constructor(
    message: string,
    public location: parser.Location
  ) {
    super(message)
  }

  static fromTypes(expect: Type, actual: Type, location: parser.Location): TypeError {
    return new TypeError(`expected '${expect.toString()}', but '${actual.toString()}' given`, location)
  }

}

export class SyntaxError extends Error {
  constructor(
    message: string,
    public location: parser.Location
  ) {
    super(message)
  }
}