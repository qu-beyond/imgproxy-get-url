require('dotenv').config()

module.exports = {
  imgProxy: {
    url: process.env.IMGPROXY_URL || '',
    key: process.env.IMGPROXY_KEY || null,
    salt: process.env.IMGPROXY_SALT || null
  }
}
