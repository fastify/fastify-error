'use strict'

const format = require('util').format
const { test } = require('node:test')
const formatGenerator = require('../lib/format-generator')

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
  ['%O', [{}], '{}']
]

test('formatGenerator', t => {
  t.plan(testCases.length * 2)

  for (const [testCase, args, expected] of testCases) {
    t.assert.strictEqual(formatGenerator(testCase)(args), expected)
    t.assert.strictEqual(formatGenerator(testCase)(args), format(testCase, ...args))
  }
})
