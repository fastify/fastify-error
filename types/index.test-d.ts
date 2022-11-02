import createError, { FastifyError, FastifyErrorConstructor, isFastifyError } from '..'
import { expectType } from 'tsd'

const CustomError = createError('ERROR_CODE', 'message')
expectType<FastifyErrorConstructor>(CustomError)
const err = new CustomError()
expectType<FastifyError>(err)
expectType<string>(err.code)
expectType<string>(err.message)
expectType<number>(err.statusCode!)

expectType<boolean>(isFastifyError(err))

if (isFastifyError(err)) {
  expectType<FastifyError>(err)
}
