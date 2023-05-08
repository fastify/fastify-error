import createError, { FastifyError, FastifyErrorConstructor } from '..'
import { expectType, expectError } from 'tsd'

const CustomError = createError('ERROR_CODE', 'message')
expectType<FastifyErrorConstructor<{ code: 'ERROR_CODE' }>>(CustomError)
const err = new CustomError()
expectType<FastifyError & { code: 'ERROR_CODE' }>(err)
expectType<'ERROR_CODE'>(err.code)
expectType<string>(err.message)
expectType<number | undefined>(err.statusCode)

const CustomTypedError = createError('OTHER_CODE', 'message', 400)
expectType<FastifyErrorConstructor<{ code: 'OTHER_CODE', statusCode: 400 }>>(CustomTypedError)
const typed = new CustomTypedError()
expectType<FastifyError & { code: 'OTHER_CODE', statusCode: 400 }>(typed)
expectType<'OTHER_CODE'>(typed.code)
expectType<string>(typed.message)
expectType<400>(typed.statusCode)

const CustomTypedArgError = createError<[string]>('OTHER_CODE', 'expect %s message', 400)
CustomTypedArgError('a')
expectError(CustomTypedArgError('a', 'b'))
expectError(new CustomTypedArgError('a', 'b'))
expectError(CustomTypedArgError(1))
expectError(new CustomTypedArgError(1))

const CustomTypedArgError2 = createError<string, number, [string]>('OTHER_CODE', 'expect %s message', 400)
CustomTypedArgError2('a')
expectError(CustomTypedArgError2('a', 'b'))
expectError(new CustomTypedArgError2('a', 'b'))
expectError(CustomTypedArgError2(1))
expectError(new CustomTypedArgError2(1))
