'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
	// 添加快捷
    router.post(`${prefix}/quick`, controller.quick.create)
    // 删除快捷
    router.delete(`${prefix}/quick/detail/:id`, controller.quick.remove)
    // 修改快捷
    router.patch(`${prefix}/quick/detail/:id`, controller.quick.update)
    // 获取快捷列表
    router.get(`${prefix}/quick/list`, controller.quick.list)
    // 获取快捷详情
    router.get(`${prefix}/quick/detail/:id`, controller.quick.detail)
}

module.exports = router