'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {

    // 创建产品规格
    router.post(`${prefix}/sku`, controller.sku.create)
    // 获取规格列表
    router.get(`${prefix}/sku/list`, controller.sku.list)
    // 获取规格详情
    router.get(`${prefix}/sku/detail/:id`, controller.sku.detail)
    // 修改规格详情
    router.patch(`${prefix}/sku/detail/:id`, controller.sku.update)
    // 删除规格
    router.delete(`${prefix}/sku/detail/:id`, controller.sku.remove)
    
    //---------------------

    // 用户端获取产品规格列表
    router.get(`${prefix}/m/goods/:pid/sku`, controller.sku.m_list)
}

module.exports = router