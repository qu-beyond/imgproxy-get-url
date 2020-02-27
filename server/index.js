const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()
const basicAuth = require('express-basic-auth')
const configNuxt = require('../nuxt.config.js')
const config = require('../config')
const api = require('./api')

// Import and Set Nuxt.js options
configNuxt.dev = process.env.NODE_ENV !== 'production'

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(configNuxt)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  // Build only in dev mode
  if (configNuxt.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  if (config.basicAuthUsers) {
    app.use(
      basicAuth({
        users: config.basicAuthUsers,
        challenge: true
      })
    )
  }

  // Add API Endpoints
  app.use('/api', api)

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
