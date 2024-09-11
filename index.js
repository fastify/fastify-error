'use strict'

const formatGenerator = require('./lib/format-generator')
const countSpecifiers = require('./lib/count-specifiers')

function toString () {
  return `${this.name} [${this.code}]: ${this.message}`
}

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()
  !statusCode && (statusCode = undefined)

  const specifiersAmount = countSpecifiers(message)
  const format = formatGenerator(message)
  const withOptionsParameterLength = specifiersAmount + 1

  function FastifyError (...args) {
    if (!new.target) {
      return new FastifyError(...args)
    }

    this.code = code
    this.name = 'FastifyError'
    this.statusCode = statusCode

    if (
      args.length === withOptionsParameterLength &&
      typeof args[specifiersAmount] === 'object' &&
      'cause' in args[specifiersAmount]
    ) {
      this.cause = args[specifiersAmount].cause
    }

    this.message = format(args)

    Error.stackTraceLimit !== 0 && Error.captureStackTrace(this, FastifyError)
  }

  FastifyError.prototype = Object.create(Base.prototype, {
    constructor: {
      value: FastifyError,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })

  FastifyError.prototype[Symbol.toStringTag] = 'Error'

  FastifyError.prototype.toString = toString

  return FastifyError
}

module.exports = createError
module.exports.default = createError
module.exports.createError = createError
