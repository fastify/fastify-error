'use strict'

const test = require('tap').test
const countSpecifiers = require('../../lib/countSpecifiers')

const testCases = [
  ['no specifier', 0],
  ['a string %s', 1],
  ['a number %d', 1],
  ['an integer %i', 1],
  ['a float %f', 1],
  ['as json %j', 1],
  ['as object %o', 1],
  ['as object %O', 1],
  ['as css %c', 1],
  ['not a specifier %%', 0],
  ['mixed %s %%%s', 2]
]
test('countSpecifiers', t => {
  t.plan(testCases.length)

  for (const [testCase, expected] of testCases) {
    t.test(testCase, t => {
      t.plan(1)
      t.equal(countSpecifiers(testCase), expected)
    })

  }
})
