require('dotenv').config()

const getBasicAuthUsers = function(users) {
  if (typeof users !== 'string') {
    return null
  }
  const usersParsed = users
    .split(',')
    .map((user) => {
      const usr = user.split(':')
      if (usr.length === 2) {
        return {
          [usr[0]]: usr[1]
        }
      } else {
        return null
      }
    })
    .filter((user) => user !== null)
  if (usersParsed.length === 0) {
    return null
  }
  return usersParsed.reduce((accumulator, user) => {
    for (const [key, value] of Object.entries(user)) {
      accumulator[key] = value
    }
    return accumulator
  }, {})
}

module.exports = {
  imgProxy: {
    url: process.env.IMGPROXY_URL || '',
    key: process.env.IMGPROXY_KEY || null,
    salt: process.env.IMGPROXY_SALT || null
  },
  basicAuthUsers: getBasicAuthUsers(process.env.BASIC_AUTH_USERS) // Format: test:1234,test2:password
}
