'use strict';

const prefix = require('../../config/prefix')
const clientJwt = require('../middleware/clientJwt').check
const WXPay = require('../middleware/wx')

console.log(WXPay.middleware)

const router = function (router, controller) {
	// 微信授权回跳
    router.get(`${prefix}/wx/auth/callback`, controller.wx.authCallback)

    // 微信支付异步回掉接口
    router.post(`${prefix}/wx/unifiedorder/callback`, WXPay.middleware('pay'), controller.wx.unifiedorderCallback)
    
    // 微信查询订单号
    router.post(`${prefix}/m/wx/unifiedorder/status`, clientJwt, controller.wx.unifiedorderQuery)

    // 微信获取ticket
    router.post(`${prefix}/m/wx/getTicket`, clientJwt, controller.wx.getTicket)
}

module.exports = router