'use strict'

const { format } = require('util')

function createError (code, message, statusCode = 500, Base = Error) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()

  class FastifyError extends Base {
    constructor (a, b, c) {
      super()
      if (!new.target) {
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

    get [Symbol.toStringTag] () {
      return 'Error'
    }

    toString () {
      return `${this.name} [${this.code}]: ${this.message}`
    }
  }

  return FastifyError
}

module.exports = createError
