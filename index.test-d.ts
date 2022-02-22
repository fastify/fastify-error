import createError, { FastifyError, FastifyErrorConstructor, RFC7807Error } from './'
import { expectType } from 'tsd'

const CustomError = createError('ERROR_CODE', 'message')
expectType<FastifyErrorConstructor>(CustomError)
const err = new CustomError()
expectType<FastifyError>(err)
expectType<string>(err.code)
expectType<string>(err.message)
expectType<number>(err.statusCode!)

expectType<RFC7807Error>(err.toRFC7807());
expectType<RFC7807Error>(err.toRFC7807('/dev/null'));
expectType<RFC7807Error>(err.toRFC7807(undefined, { description: 'missing value for key'}));
