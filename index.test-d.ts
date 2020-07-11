import createError, { FastifyError, ValidationResult } from './'
import { expectType } from 'tsd'

const error = createError('CODE', 'message')
expectType<FastifyError>(error)
expectType<string>(error.code)
expectType<string>(error.message)
expectType<number>(error.statusCode!)
expectType<ValidationResult[]>(error.validation!)

expectType<ValidationResult['params']>({
  stringParam: 'a',
  stringArrayParam: ['a', 'b', 'c'],
} as Record<string, string | string[]>);
