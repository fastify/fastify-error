'use strict'

const test = require('node:test')
const { createRFC9457Error } = require('..')

test('toProblemDetails() with defaults', (t) => {
  t.plan(1)

  const E = createRFC9457Error('CODE', 'oops')
  const e = new E()
  const pd = e.toProblemDetails()

  t.assert.deepStrictEqual(pd, {
    type: 'about:blank',
    title: 'Internal Server Error',
    status: 500,
    detail: 'oops',
    instance: '',
    code: 'CODE',
    details: {}
  })
})

test('title defaults to the HTTP reason phrase for the status', (t) => {
  t.plan(1)

  const NotFound = createRFC9457Error('NOT_FOUND', 'user %s does not exist', 404)
  const pd = new NotFound('alice').toProblemDetails('/users/alice')

  t.assert.deepStrictEqual(pd, {
    type: 'about:blank',
    title: 'Not Found',
    status: 404,
    detail: 'user alice does not exist',
    instance: '/users/alice',
    code: 'NOT_FOUND',
    details: {}
  })
})

test('toProblemDetails() with custom type, title and extension details', (t) => {
  t.plan(1)

  const Warning = createRFC9457Error(
    'WARN',
    'Threshold exceeded by %d',
    429,
    { type: 'https://example.net/probs/warn', title: 'Warning' }
  )
  const w = new Warning(7)

  const pd = w.toProblemDetails('/limit', { retryAfter: 60, exceeded: true })

  t.assert.deepStrictEqual(pd, {
    type: 'https://example.net/probs/warn',
    title: 'Warning',
    status: 429,
    detail: 'Threshold exceeded by 7',
    instance: '/limit',
    code: 'WARN',
    details: { retryAfter: 60, exceeded: true }
  })
})

test('title falls back to a generic label for unknown status codes', (t) => {
  t.plan(2)

  const E = createRFC9457Error('WEIRD', 'unusual status', 599)
  const pd = new E().toProblemDetails()

  t.assert.equal(pd.title, 'Unknown Error')
  t.assert.equal(pd.status, 599)
})

test('toProblemDetails() falls back to the factory statusCode when the instance has none', (t) => {
  t.plan(2)

  // createError drops a falsy statusCode from the instance
  const E = createRFC9457Error('CODE', 'oops', 0)
  const pd = new E().toProblemDetails()

  t.assert.equal(pd.status, 0)
  t.assert.equal(pd.title, 'Unknown Error')
})

test('toProblemDetails() honors an overridden instance statusCode', (t) => {
  t.plan(2)

  const E = createRFC9457Error('CODE', 'oops', 500)
  const e = new E()
  e.statusCode = 502
  const pd = e.toProblemDetails()

  t.assert.equal(pd.status, 502)
  t.assert.equal(pd.title, 'Bad Gateway')
})

test('created errors behave like regular fastify errors', (t) => {
  t.plan(5)

  const E = createRFC9457Error('CODE', 'hey %s', 400)
  const err = new E('alice')

  t.assert.ok(err instanceof Error)
  t.assert.equal(err.name, 'FastifyError')
  t.assert.equal(err.code, 'CODE')
  t.assert.equal(err.message, 'hey alice')
  t.assert.equal(err.toString(), 'FastifyError [CODE]: hey alice')
})
