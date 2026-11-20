'use strict'

const { STATUS_CODES } = require('node:http')
const { format } = require('node:util')

function toString () {
  return `${this.name} [${this.code}]: ${this.message}`
}

const FastifyGenericErrorSymbol = Symbol.for('fastify-error-generic')

function createError (code, message, statusCode = 500, Base = Error, captureStackTrace = createError.captureStackTrace) {
  const shouldCreateFastifyGenericError = code === FastifyGenericErrorSymbol

  if (shouldCreateFastifyGenericError) {
    code = 'FST_ERR'
  }

  if (!code) throw new Error('Fastify error code must not be empty')
  if (!message) throw new Error('Fastify error message must not be empty')

  code = code.toUpperCase()
  !statusCode && (statusCode = undefined)

  const FastifySpecificErrorSymbol = Symbol.for(`fastify-error ${code}`)

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
    [FastifyGenericErrorSymbol]: {
      value: true,
      enumerable: false,
      writable: false,
      configurable: false
    },
    [FastifySpecificErrorSymbol]: {
      value: true,
      enumerable: false,
      writable: false,
      configurable: false
    }
  })

  if (shouldCreateFastifyGenericError) {
    Object.defineProperty(FastifyError, Symbol.hasInstance, {
      value (instance) {
        return instance && instance[FastifyGenericErrorSymbol]
      },
      configurable: false,
      writable: false,
      enumerable: false
    })
  } else {
    Object.defineProperty(FastifyError, Symbol.hasInstance, {
      value (instance) {
        return instance && instance[FastifySpecificErrorSymbol]
      },
      configurable: false,
      writable: false,
      enumerable: false
    })
  }

  FastifyError.prototype[Symbol.toStringTag] = 'Error'

  FastifyError.prototype.toString = toString

  return FastifyError
}

function createRFC9457Error (
  code,
  message,
  statusCode = 500,
  opts = {},
  Base = Error,
  captureStackTrace = createError.captureStackTrace
) {
  const RFC9457Error = createError(code, message, statusCode, Base, captureStackTrace)

  const type = opts.type || 'about:blank'
  const title = opts.title

  RFC9457Error.prototype.toProblemDetails = function (instance = '', details = {}) {
    const status = this.statusCode ?? statusCode

    return {
      type,
      // RFC 9457 recommends the HTTP status reason phrase as the title
      // when no dedicated title is available
      title: title || STATUS_CODES[status] || 'Unknown Error',
      status,
      detail: this.message,
      instance,
      code: this.code,
      details
    }
  }

  return RFC9457Error
}

createError.captureStackTrace = true

const FastifyErrorConstructor = createError(FastifyGenericErrorSymbol, 'Fastify Error', 500, Error)

module.exports = createError
module.exports.FastifyError = FastifyErrorConstructor
module.exports.default = createError
module.exports.createError = createError
module.exports.createRFC9457Error = createRFC9457Error
