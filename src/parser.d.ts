// http://qiita.com/m0a/items/710b8f2b8327868cf049

import * as AST from './ast'

export module parser{
  interface ParserOptions {
    startRule?: string
    tracer: any
  }

  export interface Location {
    start: {
      offset: number,
      line: number,
      column: number
    }
    end: {
      offset: number,
      line: number,
      column: number
    }
  }

  export class SyntaxError extends Error {
    message: string
    expected: string | null
    found: string | null
    location: Location
    name : 'SyntaxError'
  }

  export function parse(input: string, options?:ParserOptions): AST.ASTNode
}