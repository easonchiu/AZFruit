'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {

    //------------------商品接口
	// 创建产品
    router.post(`${prefix}/goods`, controller.goods.create)
    // 获取列表
    router.get(`${prefix}/goods/list`, controller.goods.list)
    // 获取详情
    router.get(`${prefix}/goods/detail/:id`, controller.goods.detail)
    // 修改详情
    router.patch(`${prefix}/goods/detail/:id`, controller.goods.update)
    
    //------------------排序接口
    // 拉取排行榜数据
    router.get(`${prefix}/goods/ranking`, controller.goods.rankingList)
    // 更新排行榜
    router.patch(`${prefix}/goods/ranking`, controller.goods.updateRanking)
    // 拉取推荐榜数据
    router.get(`${prefix}/goods/recom`, controller.goods.recomList)
    // 更新推荐榜
    router.patch(`${prefix}/goods/recom`, controller.goods.updateRecom)

    //---------------------

    // 拉取排行榜数据
    router.get(`${prefix}/m/goods/ranking`, controller.goods.m_rankingList)
    // 拉取推荐榜数据
    router.get(`${prefix}/m/goods/recommend`, controller.goods.m_recomList)
    // 用户端获取全部产品列表
    router.get(`${prefix}/m/goods`, controller.goods.m_list)
    // 用户端获取产品详情
    router.get(`${prefix}/m/goods/:id`, controller.goods.m_detail)
}

module.exports = router