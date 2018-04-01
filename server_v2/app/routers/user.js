'use strict';

const prefix = require('../../config/prefix')
const clientJwt = require('../middleware/clientJwt').check

const router = function (router, controller) {
	// 获取列表
    router.get(`${prefix}/user/list`, controller.user.list)
    // 查看详情
    router.get(`${prefix}/user/detail/:id`, controller.user.detail)

    //-------------------
    // 前端登录（没有则注册）
    router.post(`${prefix}/m/user/login`, controller.user.m_login)
    // 前端获取验证码
    router.post(`${prefix}/m/user/verifcode`, controller.user.m_getVerifcode)
    // 获取用户详情
    router.get(`${prefix}/m/user`, clientJwt, controller.user.m_detail)
    

    // 获取购物车内产品的数量
    router.get(`${prefix}/m/shoppingcart/amount`, clientJwt, controller.shoppingcart.m_amount)
    // 获取购物车内的产品
    router.get(`${prefix}/m/shoppingcart`, clientJwt, controller.shoppingcart.m_list)
    // 更新购物车内的产品
    router.patch(`${prefix}/m/shoppingcart`, clientJwt, controller.shoppingcart.m_update)
    // 将商品加入到购物车
    router.post(`${prefix}/m/shoppingcart`, clientJwt, controller.shoppingcart.m_append)
    

    // 获取优惠券列表
    router.get(`${prefix}/m/coupon`, clientJwt, controller.coupon.m_list)
    

    // 添加新地址
    router.post(`${prefix}/m/address`, clientJwt, controller.address.m_create)
    // 修改地址
    router.patch(`${prefix}/m/address`, clientJwt, controller.address.m_update)
    // 获取地址列表
    router.get(`${prefix}/m/address`, clientJwt, controller.address.m_list)
    // 删除地址
    router.delete(`${prefix}/m/address`, clientJwt, controller.address.m_remove)
    // 获取地址详情
    router.get(`${prefix}/m/address/:id`, clientJwt, controller.address.m_detail)
}

module.exports = router