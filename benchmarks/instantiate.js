'use strict'

const benchmark = require('benchmark')
const createError = require('..')

const FastifyError = createError('CODE', 'Not available')

new benchmark.Suite()
  .add('instantiate Error', function () { new Error() }, { minSamples: 100 }) // eslint-disable-line no-new
  .add('instantiate FastifyError', function () { new FastifyError() }, { minSamples: 100 }) // eslint-disable-line no-new
  .on('cycle', function onCycle (event) { console.log(String(event.target)) })
  .run({ async: false })
