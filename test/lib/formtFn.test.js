'use strict'

const test = require('tap').test
const formatFn = require('../../lib/formatFn')
const format = require('util').format

const testCases = [
  ['no specifier', [], 'no specifier'],
  ['string %s', [0], 'string 0'],
  // ['string %s', [0n], 'string 0n'],
  ['string %s', ['yes'], 'string yes']
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

  for (const [testCase, args, expected] of testCases) {
    t.test(testCase, t => {
      t.plan(1)
      t.equal(formatFn(testCase)(args), format(testCase, ...args))
    })
  }
})
