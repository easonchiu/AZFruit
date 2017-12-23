var router = require('koa-router')()
var prefix = require('../conf/prefix')
var wx = require('../controllers/wx')
var clientJWT = require('../middlewares/clientJwt')

router
	// 微信授权回跳
	.get(`${prefix.app}/wx/auth/callback`, wx.authCallback)


module.exports = router