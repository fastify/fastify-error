import { expect } from 'tstyche'
import createError, { FastifyError, FastifyErrorConstructor, RFC9457Error, RFC9457ErrorConstructor, RFC9457ProblemDetails, createRFC9457Error } from '..'

const CustomError = createError('ERROR_CODE', 'message')
expect(CustomError).type.toBe<
  FastifyErrorConstructor<{ code: 'ERROR_CODE' }>
>()
const err = new CustomError()
expect(err).type.toBe<FastifyError & { code: 'ERROR_CODE' }>()
expect(err.code).type.toBe<'ERROR_CODE'>()
expect(err.message).type.toBe<string>()
expect(err.statusCode).type.toBe<number | undefined>()

const CustomErrorNoStackTrace = createError(
  'ERROR_CODE',
  'message',
  undefined,
  undefined,
  false
)
expect(CustomErrorNoStackTrace).type.toBe<
  FastifyErrorConstructor<{ code: 'ERROR_CODE' }>
>()
const errNoStackTrace = new CustomErrorNoStackTrace()
expect(errNoStackTrace).type.toBe<FastifyError & { code: 'ERROR_CODE' }>()
expect(errNoStackTrace.code).type.toBe<'ERROR_CODE'>()
expect(errNoStackTrace.message).type.toBe<string>()
expect(errNoStackTrace.statusCode).type.toBe<number | undefined>()

const CustomTypedError = createError('OTHER_CODE', 'message', 400)
expect(CustomTypedError).type.toBe<
  FastifyErrorConstructor<{ code: 'OTHER_CODE'; statusCode: 400 }>
>()
const typed = new CustomTypedError()
expect(typed).type.toBe<
  FastifyError & { code: 'OTHER_CODE'; statusCode: 400 }
>()
expect(typed.code).type.toBe<'OTHER_CODE'>()
expect(typed.message).type.toBe<string>()
expect(typed.statusCode).type.toBe<400>()

/* eslint-disable no-new */
const CustomTypedArgError = createError<[string]>(
  'OTHER_CODE',
  'expect %s message',
  400
)
CustomTypedArgError('a')
expect(CustomTypedArgError).type.not.toBeCallableWith('a', 'b')
expect(CustomTypedArgError).type.not.toBeConstructableWith('a', 'b')
expect(CustomTypedArgError).type.not.toBeCallableWith(1)
expect(CustomTypedArgError).type.not.toBeConstructableWith(1)

const CustomTypedArgError2 = createError<string, number, [string]>(
  'OTHER_CODE',
  'expect %s message',
  400
)
CustomTypedArgError2('a')
expect(CustomTypedArgError2).type.not.toBeCallableWith('a', 'b')
expect(CustomTypedArgError2).type.not.toBeConstructableWith('a', 'b')
expect(CustomTypedArgError2).type.not.toBeCallableWith(1)
expect(CustomTypedArgError2).type.not.toBeConstructableWith(1)

const CustomTypedArgError3 = createError<string, number, [string, string]>(
  'OTHER_CODE',
  'expect %s message but got %s',
  400
)
expect(CustomTypedArgError3).type.not.toBeCallableWith('a')
CustomTypedArgError3('a', 'b')
new CustomTypedArgError3('a', 'b')
expect(CustomTypedArgError3).type.not.toBeCallableWith(1)
expect(CustomTypedArgError3).type.not.toBeConstructableWith(1)
expect(CustomTypedArgError3).type.not.toBeConstructableWith(1, 2)
expect(CustomTypedArgError3).type.not.toBeConstructableWith('1', 2)
expect(CustomTypedArgError3).type.not.toBeConstructableWith(1, '2')

const CustomTypedArgError4 = createError<string, number, [string, string]>(
  'OTHER_CODE',
  'expect %s message but got %s',
  400
)
expect(CustomTypedArgError4).type.not.toBeCallableWith('a')
CustomTypedArgError4('a', 'b')
new CustomTypedArgError4('a', 'b')
expect(CustomTypedArgError4).type.not.toBeCallableWith(1)
expect(CustomTypedArgError4).type.not.toBeConstructableWith(1)
expect(CustomTypedArgError4).type.not.toBeConstructableWith(1, 2)
expect(CustomTypedArgError4).type.not.toBeConstructableWith('1', 2)
expect(CustomTypedArgError4).type.not.toBeConstructableWith(1, '2')

const CustomTypedArgError5 = createError<[string, string, string, string]>(
  'OTHER_CODE',
  'expect %s message but got %s. Please contact %s by emailing to %s',
  400
)
expect(CustomTypedArgError5).type.not.toBeCallableWith('a')
expect(CustomTypedArgError5).type.not.toBeConstructableWith('a', 'b')
expect(CustomTypedArgError5).type.not.toBeConstructableWith('a', 'b', 'c')
CustomTypedArgError5('a', 'b', 'c', 'd')
expect(CustomTypedArgError5).type.not.toBeConstructableWith(
  'a',
  'b',
  'c',
  'd',
  'e'
)

const CustomTypedArgError6 = createError<
  string,
  number,
  [string, string, string, string]
>(
  'OTHER_CODE',
  'expect %s message but got %s. Please contact %s by emailing to %s',
  400
)
expect(CustomTypedArgError6).type.not.toBeCallableWith('a')
expect(CustomTypedArgError6).type.not.toBeConstructableWith('a', 'b')
expect(CustomTypedArgError6).type.not.toBeConstructableWith('a', 'b', 'c')
CustomTypedArgError6('a', 'b', 'c', 'd')
expect(CustomTypedArgError6).type.not.toBeConstructableWith(
  'a',
  'b',
  'c',
  'd',
  'e'
)

const CustomErrorWithErrorConstructor = createError(
  'ERROR_CODE',
  'message',
  500,
  TypeError
)
expect(CustomErrorWithErrorConstructor).type.toBe<
  FastifyErrorConstructor<{ code: 'ERROR_CODE'; statusCode: 500 }>
>()
CustomErrorWithErrorConstructor({ cause: new Error('Error') })
const customErrorWithErrorConstructor = CustomErrorWithErrorConstructor()
if (customErrorWithErrorConstructor instanceof FastifyError) {
  expect(customErrorWithErrorConstructor.code).type.toBe<'ERROR_CODE'>()
  expect(customErrorWithErrorConstructor.message).type.toBe<string>()
  expect(customErrorWithErrorConstructor.statusCode).type.toBe<500>()
}

const error = new FastifyError('ERROR_CODE', 'message', 500)
if (error instanceof FastifyError) {
  expect(error.code).type.toBe<string>()
  expect(error.message).type.toBe<string>()
  expect(error.statusCode).type.toBe<number | undefined>()
}

const RFC9457CustomError = createRFC9457Error('ERROR_CODE', 'message')
expect(RFC9457CustomError).type.toBe<
  RFC9457ErrorConstructor<{ code: 'ERROR_CODE' }>
>()
const rfc9457Err = new RFC9457CustomError()
expect(rfc9457Err).type.toBe<RFC9457Error & { code: 'ERROR_CODE' }>()
expect(rfc9457Err.code).type.toBe<'ERROR_CODE'>()
expect(rfc9457Err.message).type.toBe<string>()
expect(rfc9457Err.statusCode).type.toBe<number | undefined>()

const problemDetails = rfc9457Err.toProblemDetails('/path', { extra: 1 })
expect(problemDetails).type.toBe<RFC9457ProblemDetails>()
expect(problemDetails.type).type.toBe<string>()
expect(problemDetails.title).type.toBe<string>()
expect(problemDetails.status).type.toBe<number>()
expect(problemDetails.detail).type.toBe<string>()
expect(problemDetails.instance).type.toBe<string>()
expect(problemDetails.code).type.toBe<string>()
expect(problemDetails.details).type.toBe<Record<string, unknown>>()

const RFC9457TypedError = createRFC9457Error(
  'OTHER_CODE',
  'message',
  400,
  { type: 'https://example.net/probs/other', title: 'Other' }
)
expect(RFC9457TypedError).type.toBe<
  RFC9457ErrorConstructor<{ code: 'OTHER_CODE'; statusCode: 400 }>
>()
const rfc9457Typed = new RFC9457TypedError()
expect(rfc9457Typed).type.toBe<
  RFC9457Error & { code: 'OTHER_CODE'; statusCode: 400 }
>()
expect(rfc9457Typed.statusCode).type.toBe<400>()

const RFC9457TypedArgError = createRFC9457Error<[string]>(
  'ARG_CODE',
  'expect %s message',
  400
)
RFC9457TypedArgError('a')
expect(RFC9457TypedArgError).type.not.toBeCallableWith('a', 'b')
expect(RFC9457TypedArgError).type.not.toBeConstructableWith('a', 'b')
expect(RFC9457TypedArgError).type.not.toBeCallableWith(1)
expect(RFC9457TypedArgError).type.not.toBeConstructableWith(1)
