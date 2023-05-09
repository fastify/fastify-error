'use strict'

const test = require('tap').test
const formatFn = require('../../lib/formatFn')
const format = require('util').format

const circular = {}
circular.circular = circular

const testCases = [
  ['%%', [], '%%'],
  ['%% %s', [], '%% %s'],
  ['%% %d', [2], '% 2'],
  ['no specifier', [], 'no specifier'],
  ['string %s', [0], 'string 0'],
  ['string %s', [-0], 'string -0'],
  ['string %s', [0n], 'string 0n'],
  ['string %s', [Infinity], 'string Infinity'],
  ['string %s', [-Infinity], 'string -Infinity'],
  ['string %s', [-NaN], 'string NaN'],
  ['string %s', [undefined], 'string undefined'],
  ['%s', [{ toString: () => 'Foo' }], 'Foo'],
  ['integer %i', [0n], 'integer 0n'],
  ['integer %i', [Infinity], 'integer NaN'],
  ['integer %i', [-Infinity], 'integer NaN'],
  ['integer %i', [NaN], 'integer NaN'],
  ['string %s', ['yes'], 'string yes'],
  ['float %f', [0], 'float 0'],
  ['float %f', [-0], 'float 0'],
  ['float %f', [0.0000001], 'float 1e-7'],
  ['float %f', [0.000001], 'float 0.000001'],
  ['float %f', ['a'], 'float NaN'],
  ['float %f', [{}], 'float NaN'],
  ['json %j', [{}], 'json {}'],
  ['json %j', [circular], 'json [Circular]'],
  ['%s:%s', ['foo'], 'foo:%s'],
  ['%s:%c', ['foo', 'bar'], 'foo:'],
  ['%o', [{}], '{}'],
  ['%O', [{}], '{}'],
  ['1', [2, 3], '1 2 3']
]
test('formatFn', t => {
  t.plan(testCases.length)

  for (const [testCase, args, expected] of testCases) {
    t.test(testCase, t => {
      t.plan(2)
      t.equal(formatFn(testCase)(args), expected)
      t.equal(formatFn(testCase)(args), format(testCase, ...args))
    })
  }
})
