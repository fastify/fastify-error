'use strict'

const { format } = require('node:util')

const FastifyErrorSymbol = Symbol.for('fastify-error')

function toString () {
  return `${this.name} [${this.code}]: ${this.message}`
}

function createError (code, message, statusCode = 500, Base = Error, captureStackTrace = createError.captureStackTrace) {
  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()
  !statusCode && (statusCode = undefined)

  function FastifyError (...args) {
    if (!new.target) {
      return new FastifyError(...args)
    }

    this.code = code
    this.name = 'FastifyError'
    this.statusCode = statusCode

    const lastElement = args.length - 1
    if (lastElement !== -1 && args[lastElement] && typeof args[lastElement] === 'object' && 'cause' in args[lastElement]) {
      this.cause = args.pop().cause
    }

    this.message = format(message, ...args)

    Error.stackTraceLimit && captureStackTrace && Error.captureStackTrace(this, FastifyError)
  }

  FastifyError.prototype = Object.create(Base.prototype, {
    constructor: {
      value: FastifyError,
      enumerable: false,
      writable: true,
      configurable: true
    },
    [FastifyErrorSymbol]: {
      value: true,
      enumerable: false,
      writable: false,
      configurable: false
    },
  })

  FastifyError.prototype[Symbol.toStringTag] = 'Error'

  FastifyError.prototype.toString = toString

  return FastifyError
}

createError.captureStackTrace = true

const FastifyErrorConstructor = createError('FST_ERR', 'Fastify Error', 500, Error)
Object.defineProperty(FastifyErrorConstructor, Symbol.hasInstance, {
  value: function (instance) {
    return instance && instance[FastifyErrorSymbol]
  },
  configurable: true,
  enumerable: false
})

module.exports = createError
module.exports.FastifyError = FastifyErrorConstructor
module.exports.default = createError
module.exports.createError = createError
