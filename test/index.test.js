'use strict'

const { test } = require('node:test')
const assert = require('node:assert')
const createError = require('..')

test('Create error with zero parameter', (t) => {
  const NewError = createError('CODE', 'Not available')
  const err = new NewError()
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'Not available')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create error with 1 parameter', (t) => {
  const NewError = createError('CODE', 'hey %s')
  const err = new NewError('alice')
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'hey alice')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create error with 1 parameter set to undefined', (t) => {
  const NewError = createError('CODE', 'hey %s')
  const err = new NewError(undefined)
  assert.equal(err.message, 'hey undefined')
})

test('Create error with 2 parameters', (t) => {
  const NewError = createError('CODE', 'hey %s, I like your %s')
  const err = new NewError('alice', 'attitude')
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'hey alice, I like your attitude')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create error with 2 parameters set to undefined', (t) => {
  const NewError = createError('CODE', 'hey %s, I like your %s')
  const err = new NewError(undefined, undefined)
  assert.equal(err.message, 'hey undefined, I like your undefined')
})

test('Create error with 3 parameters', (t) => {
  const NewError = createError('CODE', 'hey %s, I like your %s %s')
  const err = new NewError('alice', 'attitude', 'see you')
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'hey alice, I like your attitude see you')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create error with 3 parameters set to undefined', (t) => {
  const NewError = createError('CODE', 'hey %s, I like your %s %s')
  const err = new NewError(undefined, undefined, undefined)
  assert.equal(err.message, 'hey undefined, I like your undefined undefined')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create error with 4 parameters set to undefined', (t) => {
  const NewError = createError('CODE', 'hey %s, I like your %s %s and %s')
  const err = new NewError(undefined, undefined, undefined, undefined)
  assert.equal(
    err.message,
    'hey undefined, I like your undefined undefined and undefined'
  )
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create error with no statusCode property', (t) => {
  const NewError = createError('CODE', 'hey %s', 0)
  const err = new NewError('dude')
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'hey dude')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, undefined)
  assert.ok(err.stack)
})

test('Should throw when error code has no fastify code', (t) => {
  assert.throws(
    () => createError(),
    new Error('Fastify error code must not be empty')
  )
})

test('Should throw when error code has no message', (t) => {
  assert.throws(
    () => createError('code'),
    new Error('Fastify error message must not be empty')
  )
})

test('Create error with different base', (t) => {
  const NewError = createError('CODE', 'hey %s', 500, TypeError)
  const err = new NewError('dude')
  assert.ok(err instanceof Error)
  assert.ok(err instanceof TypeError)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'hey dude')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('FastifyError.toString returns code', (t) => {
  const NewError = createError('CODE', 'foo')
  const err = new NewError()
  assert.equal(err.toString(), 'FastifyError [CODE]: foo')
})

test('Create the error without the new keyword', (t) => {
  const NewError = createError('CODE', 'Not available')
  const err = NewError()
  assert.ok(err instanceof Error)
  assert.equal(err.name, 'FastifyError')
  assert.equal(err.message, 'Not available')
  assert.equal(err.code, 'CODE')
  assert.equal(err.statusCode, 500)
  assert.ok(err.stack)
})

test('Create an error with cause', (t) => {
  const cause = new Error('HEY')
  const NewError = createError('CODE', 'Not available')
  const err = NewError({ cause })

  assert.ok(err instanceof Error)
  assert.equal(err.cause, cause)
})

test('Create an error with cause and message', (t) => {
  const cause = new Error('HEY')
  const NewError = createError('CODE', 'Not available: %s')
  const err = NewError('foo', { cause })

  assert.ok(err instanceof Error)
  assert.equal(err.cause, cause)
})

test('Create an error with last argument null', (t) => {
  const cause = new Error('HEY')
  const NewError = createError('CODE', 'Not available')
  const err = NewError({ cause }, null)

  assert.ok(err instanceof Error)
  assert.ifError(err.cause)
})
