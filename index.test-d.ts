import createError, { FastifyError, ValidationResult } from './'
import { expectType } from 'tsd'

const error = createError('CODE', 'message')
expectType<FastifyError>(error)

const errorConstructor = createError('CODE', 'message')
expectType<FastifyErrorConstructor>(errorConstructor)

const error = new errorConstructor()
expectType<string>(error.code)
expectType<string>(error.message)
expectType<number>(error.statusCode!)
expectType<ValidationResult[]>(error.validation!)

const errorWithoutNew = errorConstructor()
expectType<FastifyError>(errorWithoutNew)

const validationResultParams: Record<string, string | string[]> = {
  stringParam: 'a',
  stringArrayParam: ['a', 'b', 'c'],
}
expectType<ValidationResult['params']>(validationResultParams)
