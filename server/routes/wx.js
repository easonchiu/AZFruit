var router = require('koa-router')()
var prefix = require('../conf/prefix')
var wx = require('../controllers/wx')
var checkJWT = require('../middlewares/clientJwt')

router
	// 微信授权
	.post(`${prefix.app}/wx/auth`, wx.auth)


module.exports = router