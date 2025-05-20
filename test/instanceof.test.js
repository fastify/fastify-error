'use strict'

const cp = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')
const os = require('node:os')
const test = require('node:test')
const { createError, FastifyError } = require('..')

test('check if createError creates an Error which is instanceof Error', (t) => {
  t.plan(3)

  const CustomFastifyError = createError('CODE', 'Not available')
  const err = CustomFastifyError()

  t.assert.ok(err instanceof Error)
  t.assert.ok(err instanceof SyntaxError === false)
  t.assert.ok(err instanceof TypeError === false)
})

test('check if createError creates an Error which is instanceof FastifyError', (t) => {
  t.plan(4)

  const CustomFastifyError = createError('CODE', 'Not available')
  const err = CustomFastifyError()

  t.assert.ok(err instanceof Error)
  t.assert.ok(err instanceof FastifyError)
  t.assert.ok(err instanceof SyntaxError === false)
  t.assert.ok(err instanceof TypeError === false)
})

test('check if createError creates an Error with the right BaseConstructor', (t) => {
  t.plan(2)

  const CustomFastifyError = createError('CODE', 'Not available', 500, TypeError)
  const err = CustomFastifyError()

  t.assert.ok(err instanceof Error)
  t.assert.ok(err instanceof TypeError)
})

test('check if createError creates an Error with the right BaseConstructor, which is a FastifyError', (t) => {
  t.plan(6)

  const BaseFastifyError = createError('CODE', 'Not available', 500, TypeError)
  const CustomFastifyError = createError('CODE', 'Not available', 500, BaseFastifyError)
  const err = CustomFastifyError()

  t.assert.ok(err instanceof Error)
  t.assert.ok(err instanceof TypeError)
  t.assert.ok(err instanceof FastifyError)
  t.assert.ok(err instanceof BaseFastifyError)
  t.assert.ok(err instanceof CustomFastifyError)
  t.assert.ok(err instanceof SyntaxError === false)
})

test('instanceof', async (t) => {
  const assertsPlanned = 2
  t.plan(assertsPlanned)

  const testCwd = path.resolve(os.tmpdir())

  fs.mkdirSync(path.resolve(testCwd, 'node_modules', 'fastify-error'), { recursive: true })

  fs.copyFileSync(path.resolve(process.cwd(), 'index.js'), path.resolve(testCwd, 'node_modules', 'fastify-error', 'index.js'))
  fs.copyFileSync(path.resolve(process.cwd(), 'package.json'), path.resolve(testCwd, 'node_modules', 'fastify-error', 'package.json'))

  fs.mkdirSync(path.resolve(testCwd, 'node_modules', 'main', 'node_modules', 'fastify-error'), { recursive: true })

  fs.copyFileSync(path.resolve(process.cwd(), 'index.js'), path.resolve(testCwd, 'node_modules', 'main', 'node_modules', 'fastify-error', 'index.js'))
  fs.copyFileSync(path.resolve(process.cwd(), 'package.json'), path.resolve(testCwd, 'node_modules', 'main', 'node_modules', 'fastify-error', 'package.json'))

  fs.writeFileSync(path.resolve(testCwd, 'node_modules', 'main', 'package.json'), `
    {
      "name": "main",
      "version": "1.0.0",
      "description": "main",
      "main": "index.js",
      "dependencies": {
        "fastify-error": "1.0.0"
      }
    }
    `)
  fs.writeFileSync(path.resolve(testCwd, 'node_modules', 'main', 'index.js'), `
    'use strict'

    const { createError } = require('fastify-error')
    
    const Boom = createError('Boom', 'Boom', 500)

    module.exports.foo = function foo () {
        throw new Boom('foo go Boom')
    }
    `)

  fs.writeFileSync(path.resolve(testCwd, 'package.json'), `
    {
      "name": "test",
      "version": "1.0.0",
      "description": "main",
      "main": "index.js",
      "dependencies": {
        "fastify-error": "1.0.0",
        "main": "1.0.0"
      }
    }
    `)
  fs.writeFileSync(path.resolve(testCwd, 'index.js'), `
    'use strict'
    const { createError, FastifyError } = require('fastify-error')
    const { foo } = require('main')
    
    const Boom = createError('Boom', 'Boom', 500)

    try {
        foo()
    } catch (err) {
        process.send(err instanceof FastifyError)
        process.send(err instanceof Boom)
    }
    `)

  const finishedPromise = {
    promise: undefined,
    reject: undefined,
    resolve: undefined,
  }

  finishedPromise.promise = new Promise((resolve, reject) => {
    finishedPromise.resolve = resolve
    finishedPromise.reject = reject
  })

  const child = cp.fork(path.resolve(testCwd, 'index.js'), {
    cwd: testCwd,
    stdio: 'pipe',
    env: {
      ...process.env,
      NODE_OPTIONS: '--no-warnings'
    },
  })

  let messageCount = 0
  child.on('message', message => {
    try {
      switch (messageCount) {
        case 0:
          t.assert.strictEqual(message, true, 'instanceof FastifyError')
          break
        case 1:
          t.assert.strictEqual(message, false, 'instanceof Boom')
          break
      }
      if (++messageCount === assertsPlanned) {
        finishedPromise.resolve()
      }
    } catch (err) {
      finishedPromise.reject(err)
    }
  })

  child.on('error', err => {
    finishedPromise.reject(err)
  })

  await finishedPromise.promise
})
