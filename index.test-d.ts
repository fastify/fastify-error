import createError, { FastifyError, FastifyErrorConstructor } from './'
import { expectType } from 'tsd'

const CustomError = createError('ERROR_CODE', 'message')
expectType<FastifyErrorConstructor>(CustomError)
const err = new CustomError()
expectType<FastifyError>(err)
expectType<string>(err.code)
expectType<string>(err.message)
expectType<number>(err.statusCode!)