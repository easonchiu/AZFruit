const jwt = require('jsonwebtoken')
const key = require('../conf/jwt')

class Jwt {
    static createToken(data) {
        return jwt.sign(data, key)
    }
}

module.exports = Jwt