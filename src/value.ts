export type Value = Primitive | ChinoObject
export type Primitive = Integer | Boolean

export type Integer = number
export type Boolean = boolean

export class ChinoObject {
}

export class ChinoArray extends ChinoObject {
  constructor(
    public values: Value[],
    public length: number
  ) {
    super()
  }
}
