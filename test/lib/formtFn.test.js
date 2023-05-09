'use strict'

const test = require('tap').test
const formatFn = require('../../lib/formatFn')
const format = require('util').format

const circular = {}
circular.circular = circular

const testCases = [
  ['%%', [], '%'],
  ['no specifier', [], 'no specifier'],
  ['string %s', [0], 'string 0'],
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
  ['%s:%s', ['foo'], 'foo:%s']
]
test('formatFn', t => {
  t.plan(testCases.length)

  for (const [testCase, args, expected] of testCases) {
    t.test(testCase, t => {
      t.plan(1)
      t.equal(formatFn(testCase)(args), expected)
    })
  }
})

test('format compatibility', t => {
  t.plan(testCases.length)

  for (const [testCase, args] of testCases) {
    t.test(testCase, t => {
      t.plan(1)
      t.equal(formatFn(testCase)(args), format(testCase, ...args))
    })
  }
})
