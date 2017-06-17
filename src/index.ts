import * as parser from '../src/parser.js'

export function parse(code: string): any {
  return parser.parser.parse(code)
}
