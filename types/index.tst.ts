import { expect } from 'tstyche'
import createError, { FastifyError, FastifyErrorConstructor } from '..'

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
