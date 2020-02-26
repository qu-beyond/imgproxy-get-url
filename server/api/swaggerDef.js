const { name, version, description } = require('../../package.json')

module.exports = {
  swagger: '2.0',
  info: {
    // API informations (required)
    title: name, // Title (required)
    version, // Version (required)
    description // Description (optional)
  },
  // host, // Host (optional)
  basePath: '/api'
  // securityDefinitions: {
  //   BasicAuth: {
  //     type: 'basic'
  //   }
  // }
}
