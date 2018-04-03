var conf = require('../conf/wx')
var tenpay = require('tenpay')

// 初始化微信支付
const WXPay = new tenpay({
	appid: conf.appID,
	mchid: conf.mchID,
	partnerKey: conf.key,
	notify_url: 'http://www.ivcsun.com/server/api/wx/unifiedorder/callback',
	spbill_create_ip: '127.0.0.1'
})

module.exports = WXPay
