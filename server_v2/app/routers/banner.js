'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
	// 获取列表
    router.get(`${prefix}/banner/list`, controller.banner.list)
    // 保存
    router.post(`${prefix}/banner`, controller.banner.create)
    // 修改
    router.patch(`${prefix}/banner/detail/:id`, controller.banner.update)
    // 获取详情
    router.get(`${prefix}/banner/detail/:id`, controller.banner.detail)
    // 删除
    router.delete(`${prefix}/banner/detail/:id`, controller.banner.remove)
}

module.exports = router