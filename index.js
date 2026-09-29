'use strict'

const { format } = require('node:util')

const formatSpecifierRegex = /%[sdifjjoOc]/g

function countFormatSpecifiers (str) {
  if (typeof str !== 'string') return 0
  const cleaned = str.replace(/%%/g, '')
  const matches = cleaned.match(formatSpecifierRegex)
  return matches ? matches.length : 0
}

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

  const expectedParams = countFormatSpecifiers(message)

  function FastifyError (...args) {
    if (!new.target) {
      return new FastifyError(...args)
    }

    this.code = code
    this.name = 'FastifyError'
    this.statusCode = statusCode

    let formatArgs = args
    if (args.length === 1 && args[0] && typeof args[0] === 'object' && !(args[0] instanceof Error)) {
      if ('messageParams' in args[0] || ('cause' in args[0] && expectedParams > 0)) {
        if ('cause' in args[0]) {
          this.cause = args[0].cause
        }
        if ('messageParams' in args[0]) {
          formatArgs = Array.isArray(args[0].messageParams) ? args[0].messageParams : [args[0].messageParams]
        } else if (expectedParams > 0) {
          formatArgs = []
        }
      }
    }

    if (formatArgs === args) {
      const lastElement = formatArgs.length - 1
      if (lastElement !== -1 && formatArgs[lastElement] && typeof formatArgs[lastElement] === 'object' && 'cause' in formatArgs[lastElement]) {
        this.cause = formatArgs.pop().cause
      }

      if (formatArgs.length === 1 && Array.isArray(formatArgs[0])) {
        formatArgs = formatArgs[0]
      }
    }

    this.message = format(message, ...formatArgs)

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

createError.captureStackTrace = true

const FastifyErrorConstructor = createError(FastifyGenericErrorSymbol, 'Fastify Error', 500, Error)

module.exports = createError
module.exports.FastifyError = FastifyErrorConstructor
module.exports.default = createError
module.exports.createError = createError
