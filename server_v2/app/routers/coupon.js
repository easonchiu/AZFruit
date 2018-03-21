'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
	// 获取列表
    router.get(`${prefix}/coupon/list`, controller.coupon.list)
    // 查看详情
    router.get(`${prefix}/coupon/detail/:id`, controller.coupon.detail)
    // 添加
    router.patch(`${prefix}/coupon/detail/:id`, controller.coupon.update)
    // 添加
    router.post(`${prefix}/coupon`, controller.coupon.create)
}

module.exports = router