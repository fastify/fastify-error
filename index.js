'use strict'

const { inherits, format } = require('util')

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()

  function FastifyError (a, b, c) {
    if (!new.target) {
      return new FastifyError(...arguments)
    }
    Error.captureStackTrace(this, FastifyError)
    this.name = 'FastifyError'
    this.code = code

    // more performant than spread (...) operator
    switch (arguments.length) {
      case 3:
        this.message = format(message, a, b, c)
        break
      case 2:
        this.message = format(message, a, b)
        break
      case 1:
        this.message = format(message, a)
        break
      case 0:
        this.message = message
        break
      default:
        this.message = format(message, ...arguments)
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
