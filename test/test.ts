import 'mocha'
import { assert } from 'chai'
import * as fs from 'fs'
import * as ChinoScript from '../src/index'

describe('ChinoScript', function() {
  const e = (code: string) => ChinoScript.evaluate(code)

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
        assert.throw(() => ChinoScript.evaluate(code))
      }

      assertThrowTypeError('int a = "str";')
      assertThrowTypeError('int a = 2; a = "str";')
      assertThrowTypeError('let a = 2; a = "str";')

      assertThrowTypeError('let a = int[]{1, 2, 3}; a[0] = "str";')
      assertThrowTypeError('let a = int[]{1, 2, 3}; a = "str";')
      assertThrowTypeError('let a = 1; a[0] = 0;')

      assertThrowTypeError('int a = 1; if(a) { 1; } else { 2; };')
      assertThrowTypeError('int a = 1; if(a == 0) { 1; } else { "a"; };')
      assertThrowTypeError('int a = 0; if(a == 0) { "NG"; };')

      assertThrowTypeError('int f(int x) { return x * 2; } f("str");')
      assertThrowTypeError('int f(string x) { return x * 2; } f("str");')
      assertThrowTypeError('int f(int x) { return x * 2; } string str = f(1);')

      assertThrowTypeError('1 + "a";')
      assertThrowTypeError('1 || 2;')
      assertThrowTypeError('1 == "a";')
    })

    it('should pass', function() {
      assert.doesNotThrow(() => e('int a = 0; if(a == 0) { puts("OK"); };'))
    })
  })

  describe('generics type', function() {
    const eq = 'bool eq<A>(A x, A y) { return x == y; }'
    const arrayEq = `bool arrayEq<A>(A[] x, A[] y) {
          if (len(x) != len(y)) return false;;

          for (int i = 0; i < len(x); i += 1) {
            if (x[i] != y[i]) return false;;
          }
          return true;
        }`

    it('should throw type error', function() {
      assert.throw(() => e(`${eq} eq(1, 'A');`))
      assert.throw(() => e(`${arrayEq} arrayEq(int[]{1, 2, 3}, "123");`))
    })

    it('should execute correctly', function() {
      assert.equal(e(`${eq} eq(1, 1);`), true)
      assert.equal(e(`${arrayEq} arrayEq(int[]{1, 2, 3}, int[]{1, 2, 3});`), true)
    })
  })

  describe('generator function and yield', function() {
    it('should work', function() {
      assert.deepEqual(ChinoScript.valueToArray(e(`int counter() gen {
          for (int i = 0; true; i += 1) {
            yield i;
          }
        }
        let c = counter();
        int[]{next(c), next(c), next(c)};`)), [0, 1, 2])
    })
  })

  describe('string', function() {
    it('is treated as char array', function() {
      assert.doesNotThrow(() => e('char[] str = "hello";'))
      assert.doesNotThrow(() => e("string str = char[]{'H', 'e', 'l', 'l', 'o'};"))

      assert.equal(ChinoScript.valueToString(e('let str = "Helle"; str[4] = \'o\'; str;')), 'Hello')
    })
  })

  describe('float', function() {
    const ep = 0.000001
    const equalFloat = (actual: number, expected: number) => {
      assert.isTrue(expected - ep <= actual && actual <= expected + ep, `expected ${expected}, but ${actual} given.`)
    }
    it('should return correct value', function() {
      equalFloat(e('3.14;') as number, 3.14)
      equalFloat(e('3.0 + 0.14;') as number, 3.14)
      equalFloat(e('50.0 / 100.0;') as number, 0.5)
    })
  })

  describe('arithmetic operations', function() {
    it('should return correct value', function () {
      assert.equal(e('1 + 1;'), 2)
      assert.equal(e('3 - 1;'), 2)
      assert.equal(e('1 * 2;'), 2)
      assert.equal(e('6 / 3;'), 2)
      assert.equal(e('5 / 2;'), 2)

      assert.equal(e('1 + 2 + 3;'), 6)
      assert.equal(e('1 + 2 * 3 + 4;'), 11)
      assert.equal(e('(1 + 2) * (3 + 4);'), 21)
    })

    it('should accept combined operator', function() {
      assert.equal(e('let a = 0; a += 1; a;'), 1)
      assert.equal(e('let a = 2; a *= 3; a;'), 6)
    })
  })

  describe('array', function() {
    it('should be able to stored and loaded', function() {
      assert.equal(e('let ary = int[]{1, 2, 3}; ary[0];'), 1)
      assert.equal(e('let ary = int[]{1, 2, 3}; ary[0] = 0; ary[0];'), 0)
    })
  })

  describe('for statement', function() {
    it('should repeat block', function() {
      assert.equal(e('let sum = 0; for (int i = 0; i < 5; i = i + 1) { sum = sum + i; } sum;'), 10)
    })

    it('should finish when break used', function() {
      assert.equal(e(`let sum = 0;
        for (int i = 0; i < 5; i = i + 1) {
          if (i > 3) break;;
          sum = sum + i;
        }
        sum;`), 6)
    })
  })

  describe('if expr', function() {
    it('should return correct value', function() {
      assert.equal(ChinoScript.valueToString(e('if(1 == 1) { "OK"; } else { "NG"; };')), 'OK')
      assert.equal(ChinoScript.valueToString(e('if(1 != 1) { "NG"; } else { "OK"; };')), 'OK')
    })
  })

  describe('functions', function() {
    it('should return correct value from defined function', function() {
      const result = ChinoScript.evaluate(`int fact(int n) {
          if (n < 2) { return n; }
          else { return fact(n - 1) * n; };
        }

        fact(10);`)
      assert.equal(result, 3628800)
    })
  })

  describe('variable scope', function() {
    it('should allow read/write global variable', function() {
      assert.equal(e(`let a = 2;
        int f() { a; }
        f();`), 2)

      assert.equal(e(`let a = 0;
        void f() { a = a + 1; }
        f(); a;`), 1)
    })

    it('should allow use block local variable', function() {
      assert.equal(e(`let a = 1;
        if (a == 1) {
          let r = 2;
          r;
        } else {
          let r = 3;
          r;
        };
      `), 2)

      const src = `let a = 1;
        if (a == 1) {
          let a = 2;
          a;
        } else {
          let a = 3;
          a;
        };`

      assert.equal(e(src), 2)
      assert.equal(e(src + 'a;'), 1)
    })
  })

  it('should accept const variable definition'/*, function () {
    var evaluator = new ChinoScript.Evaluator()
    var c = ChinoScript.Shortcuts
    evaluator.consts.add(c.type('Integer'), c.id('CONST_VALUE'), c.int(10))

    var result = ChinoScript.evaluate('return CONST_VALUE', evaluator)
    assert.equal(result.value, 10)
  }*/)

  it('should accept function definition'/*, function () {
    var evaluator = new ChinoScript.Evaluator()
    var c = ChinoScript.Shortcuts
    var int = c.type('Integer')
    c.define_fun(evaluator, int, [int, int], 'add', function (x, y) {
      return c.int(x.value + y.value)
    })

    var result = ChinoScript.evaluate('return add(1, 2)', evaluator)
    assert.equal(result.value, 3)
  }*/)

  it('should work generic function'/*, function () {
    var evaluator = new ChinoScript.Evaluator()
    var c = ChinoScript.Shortcuts
    var aryType = c.type('Array', [c.type('A')])
    c.define_fun(evaluator, c.type('Boolean'), [aryType, aryType], 'eq', function (ary1, ary2) {
      if (ary1.value.length !== ary2.value.length) return new Values.Boolean(false)

      var ret = true
      for (var i = 0 i < ary1.value.length i++) {
        if (ary1.value[i].value !== ary2.value[i].value) {
          ret = false
          break
        }
      }
      return new ChinoScript.Values.Boolean(ret)
    }, ['A'])

    var result = ChinoScript.evaluate('return eq(int[]{1, 2, 3}, int[]{1, 2, 3})', evaluator)
    assert.equal(result.value, true)

    result = ChinoScript.evaluate('return eq(int[]{1, 2, 3}, int[]{1, 3, 2})', evaluator)
    assert.equal(result.value, false)

    assert.throws(() => ChinoScript.evaluate("return index(int[]{1, 2, 3}, char[]{'1', '2', '3' })", evaluator))
  }*/)
})
