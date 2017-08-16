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

export class ChinoData extends ChinoObject {
  constructor(
    public name: string,
    public values: Value[]
  ) {
    super()
  }
}

export class Generator extends ChinoObject {
  public pc: number = 0
  public variableEnv: { [key: string]: Value } = {}

  constructor(
    public name: string
  ) {
    super()
  }
}