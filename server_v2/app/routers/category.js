'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
	// 添加分类
    router.post(`${prefix}/category`, controller.category.create)
    // 删除分类
    router.delete(`${prefix}/category/detail/:id`, controller.category.remove)
    // 修改分类
    router.patch(`${prefix}/category/detail/:id`, controller.category.update)
    // 获取分类列表
    router.get(`${prefix}/category/list`, controller.category.list)
    // 获取使用中的分类列表
    router.get(`${prefix}/category/onlinelist`, controller.category.onlineList)
    // 获取分类详情
    router.get(`${prefix}/category/detail/:id`, controller.category.detail)
    
    //---------------------

    // 用户端获取列表
    router.get(`${prefix}/m/category`, controller.category.m_list)
}

module.exports = router