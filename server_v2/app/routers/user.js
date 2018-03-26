'use strict';

const prefix = require('../../config/prefix')
const clientJwt = require('../middleware/clientJwt')

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
    // 获取购物车内产品的数量
    router.get(`${prefix}/m/shoppingcart/amount`, clientJwt, controller.user.m_shoppingcartAmount)
    // 获取购物车内的产品
    router.get(`${prefix}/m/shoppingcart`, clientJwt, controller.user.m_shoppingcart)
    // 将商品加入到购物车
    router.post(`${prefix}/m/shoppingcart`, clientJwt, controller.user.m_addToShoppingcart)
    // 获取用户详情
    router.get(`${prefix}/m/user`, clientJwt, controller.user.m_detail)
    // 获取优惠券列表
    router.get(`${prefix}/m/coupon`, clientJwt, controller.user.m_couponList)
    // 获取地址列表
    router.get(`${prefix}/m/address`, clientJwt, controller.user.m_addressList)
    // 获取地址详情
    router.get(`${prefix}/m/address/:id`, clientJwt, controller.user.m_addressDetail)
}

module.exports = router