import 'mocha'
import { assert } from 'chai'
import * as fs from 'fs'
import * as ChinoScript from '../src/index'

describe('ChinoScript', function() {
  describe('examples', function() {
    fs.readdirSync('./examples')
      .forEach((path) => {
        it(`should work examples/${path}`, function() {
          const code = fs.readFileSync(`examples/${path}`).toString()
          assert.doesNotThrow(() => ChinoScript.evaluate(code))
        })
      })
  })

  describe('type check', function() {
    it('should throw type error', function() {
      const assertThrowTypeError = (code: string) => {
        assert.throw(() => ChinoScript.evaluate(code), ChinoScript.exceptions.TypeError)
      }

      assertThrowTypeError('int a = "str";')
      assertThrowTypeError('int a = 2; a = "str";')
      assertThrowTypeError('int a = 1; if(a) { 1 } else { 2 };')
      assertThrowTypeError('int f(int x) { return x * 2; } f("str");')
      assertThrowTypeError('int f(int x) { return x * 2; } string str = f(1);')
    })
  })

  describe('arithmetic operations', function() {
    it('should return collect value', function () {
      const e = (code: string) => ChinoScript.evaluate(code)

      assert.equal(e('1 + 1;'), 2)
      assert.equal(e('3 - 1;'), 2)
      assert.equal(e('1 * 2;'), 2)
      assert.equal(e('6 / 3;'), 2)
      assert.equal(e('5 / 2;'), 2)

      assert.equal(e('1 + 2 + 3;'), 6)
      assert.equal(e('1 + 2 * 3 + 4;'), 11)
      assert.equal(e('(1 + 2) * (3 + 4);'), 21)
    })
  })

  describe('if expr', function() {
    it('should return collect value', function() {
      const e = (code: string) => ChinoScript.evaluate(code)
      assert.equal(e('if(1 == 1) { "OK"; } else { "NG"; };'), 'OK')
      assert.equal(e('if(1 != 1) { "NG"; } else { "OK"; };'), 'OK')
    })
  })

  describe('functions', function() {
    it('should return collect value from defined function', function() {
      const result = ChinoScript.evaluate(`int fact(int n) {
          if (n < 2) { return n; }
          else { return fact(n - 1) * n; };
        }

        fact(10);`)
      assert.equal(result, 3628800)
    })
  })

  it('should accept const variable definition', function () {
    // var evaluator = new ChinoScript.Evaluator()
    // var c = ChinoScript.Shortcuts
    // evaluator.consts.add(c.type('Integer'), c.id('CONST_VALUE'), c.int(10))

    // var result = ChinoScript.evaluate('return CONST_VALUE', evaluator)
    // assert.equal(result.value, 10)
  })

  it('should accept function definition', function () {
    // var evaluator = new ChinoScript.Evaluator()
    // var c = ChinoScript.Shortcuts
    // var int = c.type('Integer')
    // c.define_fun(evaluator, int, [int, int], 'add', function (x, y) {
    //   return c.int(x.value + y.value)
    // })

    // var result = ChinoScript.evaluate('return add(1, 2)', evaluator)
    // assert.equal(result.value, 3)
  })

  it('should work generic function', function () {
    // var evaluator = new ChinoScript.Evaluator()
    // var c = ChinoScript.Shortcuts
    // var aryType = c.type('Array', [c.type('A')])
    // c.define_fun(evaluator, c.type('Boolean'), [aryType, aryType], 'eq', function (ary1, ary2) {
    //   if (ary1.value.length !== ary2.value.length) return new Values.Boolean(false)

    //   var ret = true
    //   for (var i = 0 i < ary1.value.length i++) {
    //     if (ary1.value[i].value !== ary2.value[i].value) {
    //       ret = false
    //       break
    //     }
    //   }
    //   return new ChinoScript.Values.Boolean(ret)
    // }, ['A'])

    // var result = ChinoScript.evaluate('return eq(int[]{1, 2, 3}, int[]{1, 2, 3})', evaluator)
    // assert.equal(result.value, true)

    // result = ChinoScript.evaluate('return eq(int[]{1, 2, 3}, int[]{1, 3, 2})', evaluator)
    // assert.equal(result.value, false)

    // assert.throws(() => ChinoScript.evaluate("return index(int[]{1, 2, 3}, char[]{'1', '2', '3' })", evaluator))
  })
})
