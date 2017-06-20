import { Type } from './types'

export class TypeError extends Error {
  constructor(
    expect: Type,
    actual: Type
  ) {
    super(`expected '${expect.toString()}', but '${actual.toString()}'`)
  }
}