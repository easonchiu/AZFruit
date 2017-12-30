var router = require('koa-router')()
var prefix = require('../conf/prefix')
var b_coupon = require('../controllers/b.coupon')
var f_coupon = require('../controllers/f.coupon')
var jwt = require('../middlewares/jwt')
var clientJWT = require('../middlewares/clientJwt')

router
	// 获取列表
	.get(`${prefix.api}/coupon/list`, jwt, b_coupon.fetchList)
	// 查看详情
	.get(`${prefix.api}/coupon/detail/:id`, jwt, b_coupon.fetchDetail)
	// 添加
	.patch(`${prefix.api}/coupon/detail/:id`, jwt, b_coupon.update)
	// 添加
	.post(`${prefix.api}/coupon`, jwt, b_coupon.create)

	// 用户获取列表
	.get(`${prefix.app}/coupon`, clientJWT, f_coupon.fetchList)


module.exports = router