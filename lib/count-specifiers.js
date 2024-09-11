'use strict'

const countSpecifiersRE = /%[sdifjoOc%]/g

function countSpecifiers (message) {
  let result = 0
  message.replace(countSpecifiersRE, function (x) {
    if (x !== '%%') {
      result++
    }
    return x
  })

  return result
}

module.exports = countSpecifiers
