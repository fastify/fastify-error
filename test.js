'use strict'

/* eslint no-prototype-builtins: 0 */

const test = require('ava')
const createError = require('./')

test('Create error with zero parameter', t => {
  const NewError = createError('CODE', 'Not available')
  const err = new NewError()
  t.true(err instanceof Error)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'Not available')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, 500)
  t.truthy(err.stack)
})

test('Create error with 1 parameter', t => {
  const NewError = createError('CODE', 'hey %s')
  const err = new NewError('alice')
  t.true(err instanceof Error)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'hey alice')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, 500)
  t.truthy(err.stack)
})

test('Create error with 2 parameters', t => {
  const NewError = createError('CODE', 'hey %s, I like your %s')
  const err = new NewError('alice', 'attitude')
  t.true(err instanceof Error)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'hey alice, I like your attitude')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, 500)
  t.truthy(err.stack)
})

test('Create error with 3 parameters', t => {
  const NewError = createError('CODE', 'hey %s, I like your %s %s')
  const err = new NewError('alice', 'attitude', 'see you')
  t.true(err instanceof Error)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'hey alice, I like your attitude see you')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, 500)
  t.truthy(err.stack)
})

test('Create error with no statusCode property', t => {
  const NewError = createError('CODE', 'hey %s', 0)
  const err = new NewError('dude')
  t.true(err instanceof Error)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'hey dude')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, undefined)
  t.truthy(err.stack)
})

test('Should throw when error code has no fastify code', t => {
  try {
    createError()
  } catch (err) {
    t.is(err.message, 'Fastify error code must not be empty')
  }
})

test('Should throw when error code has no message', t => {
  try {
    createError('code')
  } catch (err) {
    t.is(err.message, 'Fastify error message must not be empty')
  }
})

test('Create error with different base', t => {
  const NewError = createError('CODE', 'hey %s', 500, TypeError)
  const err = new NewError('dude')
  t.true(err instanceof Error)
  t.true(err instanceof TypeError)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'hey dude')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, 500)
  t.truthy(err.stack)
})

test('FastifyError.toString returns code', t => {
  const NewError = createError('CODE', 'foo')
  const err = new NewError()
  t.is(err.toString(), 'FastifyError [CODE]: foo')
})

test('Create the error without the new keyword', t => {
  const NewError = createError('CODE', 'Not available')
  const err = NewError()
  t.true(err instanceof Error)
  t.is(err.name, 'FastifyError')
  t.is(err.message, 'Not available')
  t.is(err.code, 'CODE')
  t.is(err.statusCode, 500)
  t.truthy(err.stack)
})

test('FastifyError.toRFC7807 returns RFC7807 conform Object', t => {
  const NewError = createError('CODE', 'foo')
  const err = new NewError()
  t.is(typeof err.toRFC7807(), 'object')
  t.is(err.toRFC7807().code, 'CODE')
  t.is(err.toRFC7807().detail, 'foo')
  t.is(err.toRFC7807().title, 'FastifyError')
  t.is(err.toRFC7807().type, 'about:blank')
  t.deepEqual(err.toRFC7807().details, [])
  t.is(err.toRFC7807().instance, '')
})

test('FastifyError.toRFC7807 accepts instance', t => {
  const NewError = createError('CODE', 'foo')
  const err = new NewError()
  t.is(err.toRFC7807('/dev/null').instance, '/dev/null')
})

test('FastifyError.toRFC7807 accepts details', t => {
  const NewError = createError('CODE', 'foo')
  const err = new NewError()
  t.deepEqual(err.toRFC7807(undefined, [{ max: 'not a valid maximum value for key' }]).details, [{ max: 'not a valid maximum value for key' }])
})

test('FastifyError accepts an uriReference which is later used for toRFC7807 type attribute', t => {
  const NewError = createError('CODE', 'foo', undefined, undefined, 'https://www.fastify.io/docs/latest/Reference/Errors/#fst_err_bad_url')
  const err = new NewError()
  t.is(err.toRFC7807().type, 'https://www.fastify.io/docs/latest/Reference/Errors/#fst_err_bad_url')
})
