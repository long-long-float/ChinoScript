export type Value = Primitive | ChinoObject
export type Primitive = Integer | ChinoString | Boolean

export type Integer = number
export type ChinoString = string
export type Boolean = boolean

export class ChinoObject {
}

export class ChinoArray extends ChinoObject {
  constructor(
    values: Value[],
    length: number
  ) {
    super()
  }
}
