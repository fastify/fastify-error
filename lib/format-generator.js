'use strict'

const specifiersRE = /(%[sdifjoOc%])/g

let globalInspect

function lazyInspect () {
  if (globalInspect === undefined) { globalInspect = require('util').inspect }
  return globalInspect
}

function formatGenerator (message) {
  let inspect

  let fnBody = ''

  if (message.includes('%j')) {
    fnBody += `
      function stringify(value) {
      const stackTraceLimit = Error.stackTraceLimit
      stackTraceLimit !== 0 && (Error.stackTraceLimit = 0)
      try {
        return JSON.stringify(value)
      } catch (_e) {
        return '[Circular]'
      } finally {
        stackTraceLimit !== 0 && (Error.stackTraceLimit = stackTraceLimit)
      }
    }`
  }
  if (message.includes('%o')) {
    inspect = lazyInspect()
    fnBody += `
      const oOptions = { showHidden: true, showProxy: true }
    `
  } else if (message.includes('%O')) {
    inspect = lazyInspect()
  }

  fnBody += `
  return function format (args) {
    const argsLen = args.length
    return ""`

  let argNum = 0
  const messageParts = message.split(specifiersRE)

  for (const messagePart of messageParts) {
    switch (messagePart) {
      case '':
        break
      case '%%':
        fnBody += ' + (argsLen === 0 ? "%%" : "%")'
        break
      case '%d':
        fnBody += ` + (
          ${argNum} >= argsLen && '%d' ||
          args[${argNum}]
        )`
        argNum++
        break
      case '%i':
        fnBody += ` + (
          ${argNum} >= argsLen && '%i' ||
          typeof args[${argNum}] === 'number' && (
            args[${argNum}] === Infinity && 'NaN' ||
            args[${argNum}] === -Infinity && 'NaN' ||
            args[${argNum}] !== args[${argNum}] && 'NaN' ||
            '' + Math.trunc(args[${argNum}])
          ) ||
          typeof args[${argNum}] === 'bigint' && args[${argNum}] + 'n' ||
          parseInt(args[${argNum}], 10)
        )`
        argNum++
        break
      case '%f':
        fnBody += ` + (
          ${argNum} >= argsLen && '%f' ||
          parseFloat(args[${argNum}])
        )`
        argNum++
        break
      case '%s':
        fnBody += ` + (
          ${argNum} >= argsLen && '%s' ||
          (
            (typeof args[${argNum}] === 'bigint' && args[${argNum}].toString() + 'n') ||
            (typeof args[${argNum}] === 'number' && args[${argNum}] === 0 && 1 / args[${argNum}] === -Infinity && '-0') ||
            args[${argNum}]
          )
        )`
        argNum++
        break
      case '%o':
        fnBody += ` + (
          ${argNum} >= argsLen && '%o' ||
          inspect(args[${argNum}], oOptions)
        )`
        argNum++
        break
      case '%O':
        fnBody += ` + (
          ${argNum} >= argsLen && '%O' ||
          inspect(args[${argNum}])
        )`
        argNum++
        break
      case '%j':
        fnBody += ` + (
          ${argNum} >= argsLen && '%j' ||
          stringify(args[${argNum}])
        )`
        argNum++
        break
      case '%c':
        break
      default:
        fnBody += '+ ' + JSON.stringify(messagePart)
    }
  }

  fnBody += '}'

  return new Function('inspect', fnBody)(inspect) // eslint-disable-line no-new-func
}

module.exports = formatGenerator
