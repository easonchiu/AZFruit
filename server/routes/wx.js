var router = require('koa-router')()
var prefix = require('../conf/prefix')
var wx = require('../controllers/wx')
var clientJWT = require('../middlewares/clientJwt')

router
	// 微信授权回跳
	.get(`${prefix.app}/wx/auth/callback`, wx.authCallback)

	// 微信支付异步回掉接口
	.post(`${prefix.api}/wx/unifiedorder/callback`, wx.unifiedorderCallback)

	// 微信获取ticket
	.post(`${prefix.app}/wx/getTicket`, wx.getTicket)


module.exports = router