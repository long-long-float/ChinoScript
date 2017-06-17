import { Identifier } from './ast'

export class Type {
  constructor(
    public name: string,
    public innerTypes: Type[]
  ) {}
}