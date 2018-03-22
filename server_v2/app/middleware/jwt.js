const jwt = require('jsonwebtoken')

// 管理后台jwt key
const key = '!@#zaq2017_azfruit'

class Jwt {
    static createToken(data) {
        return jwt.sign(data, key)
    }
}

module.exports = Jwt