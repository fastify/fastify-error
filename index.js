'use strict'

const { inherits, format } = require('util')

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()

  function FastifyError (a, b, c) {
    if (!(this instanceof FastifyError)) {
      return new FastifyError(a, b, c)
    }
    Error.captureStackTrace(this, FastifyError)
    this.name = 'FastifyError'
    this.code = code

    // more performant than spread (...) operator
    if (a && b && c) {
      this.message = format(message, a, b, c)
    } else if (a && b) {
      this.message = format(message, a, b)
    } else if (a) {
      this.message = format(message, a)
    } else {
      this.message = message
    }

    this.statusCode = statusCode || undefined
  }
  FastifyError.prototype[Symbol.toStringTag] = 'Error'

  FastifyError.prototype.toString = function () {
    return `${this.name} [${this.code}]: ${this.message}`
  }

  inherits(FastifyError, Base)

  return FastifyError
}

module.exports = createError
