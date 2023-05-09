'use strict'

const { inherits } = require('util')
const formatFn = require('./lib/formatFn')

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()
  !statusCode && (statusCode = undefined)

  const format = formatFn(message)

  function FastifyError () {
    if (!new.target) {
      return new FastifyError(...args)
    }
    this.code = code
    this.name = 'FastifyError'
    this.statusCode = statusCode
    this.message = format(arguments)

    Error.stackTraceLimit !== 0 && Error.captureStackTrace(this, FastifyError)
  }

  FastifyError.prototype[Symbol.toStringTag] = 'Error'

  FastifyError.prototype.toString = function () {
    return `${this.name} [${this.code}]: ${this.message}`
  }

  inherits(FastifyError, Base)

  return FastifyError
}

module.exports = createError
module.exports.default = createError
module.exports.createError = createError
