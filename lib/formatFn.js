'use strict'

const countSpecifiers = require("./countSpecifiers")
const specifiersRE = /(%[sdifjoOc%])/g

function formatFn(message) {
  const amountOfPlaceholders = countSpecifiers(message)

  if (amountOfPlaceholders === 0) {
    return () => message
  }
  let fnBody = 'return ""'

  let argNum = 0
  const messageParts = message.split(specifiersRE)


  for (let i = 0; i < messageParts.length; ++i) {
    switch (messageParts[i]) {
      case '':
        break
      case '%%':
        fnBody += ' + "%"'
        break;
      case '%d':
        fnBody += "+ args[" + argNum++ + "]"
        break;
      case '%i':
        fnBody += "+ parseInt(args[" + argNum++ + "])"
        break;
      case '%f':
        fnBody += "+ parseFloat(args[" + argNum++ + "])"
        break;
      case '%s':
        fnBody += "+ args[" + argNum++ + "]"
        break;
      case '%j':
        fnBody += "+ JSON.stringify(args[" + argNum++ + "])"
        break;
      default:
        fnBody += "+ " + JSON.stringify(messageParts[i])
    }
  }

  return new Function('args', fnBody)
}


module.exports = formatFn
