'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
	// 取图
    router.get(`${prefix}/upload/list`, controller.upload.list)
    // 存图
    router.post(`${prefix}/upload`, controller.upload.create)
}

module.exports = router