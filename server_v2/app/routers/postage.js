'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
	// 添加运费
	router.post(`${prefix}/postage`, controller.postage.create)
	// 删除运费
	router.delete(`${prefix}/postage/detail/:id`, controller.postage.remove)
	// 修改运费
	router.patch(`${prefix}/postage/detail/:id`, controller.postage.update)
	// 获取运费列表
	router.get(`${prefix}/postage/list`, controller.postage.list)
	// 获取运费详情
	router.get(`${prefix}/postage/detail/:id`, controller.postage.detail)
}

module.exports = router