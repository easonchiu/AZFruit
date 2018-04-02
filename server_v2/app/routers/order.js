'use strict';

const prefix = require('../../config/prefix')
const clientJwt = require('../middleware/clientJwt').check

const router = function (router, controller) {
	// 获取列表
    router.get(`${prefix}/order/list`, controller.order.list)
    // 获取详情
    router.get(`${prefix}/order/detail/:orderNo`, controller.order.detail)
    // 设置订单状态
    router.patch(`${prefix}/order/status/:orderNo`, controller.order.updateStatus)

    //------------------------
    // 获取待支付的订单量
    router.get(`${prefix}/m/order/amount`, clientJwt, controller.order.m_amount)
    // 创建订单
    router.post(`${prefix}/m/order`, clientJwt, controller.order.m_create)
    // 获取订单列表
    router.get(`${prefix}/m/order`, clientJwt, controller.order.m_list)
    // 获取订单详情
    router.get(`${prefix}/m/order/:orderNo`, clientJwt, controller.order.m_detail)
    // 删除订单
    router.delete(`${prefix}/m/order/:orderNo`, clientJwt, controller.order.m_remove)
    // 支付订单
    router.post(`${prefix}/m/order/:orderNo/payment`, clientJwt, controller.order.m_payment)
}

module.exports = router