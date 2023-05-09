'use strict'

const benchmark = require('benchmark')
const createError = require('..')

Error.stackTraceLimit = 0

const FastifyError = createError('CODE', 'Not available')
const FastifySpecialError = createError('CODE', '%s available')

const Not = 'Not'

new benchmark.Suite()
  .add('instantiate Error', function () { new Error() }, { minSamples: 100 }) // eslint-disable-line no-new
  .add('instantiate FastifyError', function () { new FastifyError() }, { minSamples: 100 }) // eslint-disable-line no-new
  .add('instantiate FastifySpecialError', function () { new FastifySpecialError(Not) }, { minSamples: 100 }) // eslint-disable-line no-new
  .on('cycle', function onCycle (event) { console.log(String(event.target)) })
  .run({ async: false })
