const express = require('express')
const consola = require('consola')
const bodyParser = require('body-parser')
const app = express()
const swaggerUi = require('swagger-ui-express')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerDefinition = require('./swaggerDef')
const routes = require('./routes')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

routes.setup(app)

const options = {
  swaggerDefinition,
  apis: ['./server/api/routes*.js']
}
const swaggerSpec = swaggerJSDoc(options)
const uiOptions = {
  // explorer: true
  customCss: '.swagger-ui .topbar, .scheme-container  { display: none }'
}
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec, uiOptions))

consola.ready({
  message: 'API Endpoints added!',
  badge: true
})

module.exports = app
