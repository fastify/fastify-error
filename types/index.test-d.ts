import createError, { FastifyError, FastifyErrorConstructor } from '..'
import { expectType } from 'tsd'

const CustomError = createError('ERROR_CODE', 'message')
expectType<FastifyErrorConstructor<{ code: 'ERROR_CODE' }>>(CustomError)
const err = new CustomError()
expectType<FastifyError & { code: 'ERROR_CODE' }>(err)
expectType<'ERROR_CODE'>(err.code)
expectType<string>(err.message)
expectType<number>(err.statusCode!)

const CustomTypedError = createError('OTHER_CODE', 'message', 400)
expectType<FastifyErrorConstructor<{ code: 'OTHER_CODE'; statusCode: 400 }>>(CustomTypedError)
const typed = new CustomTypedError()
expectType<FastifyError & { code: 'OTHER_CODE'; statusCode: 400 }>(typed)
expectType<'OTHER_CODE'>(typed.code)
expectType<string>(typed.message)
expectType<400>(typed.statusCode)
