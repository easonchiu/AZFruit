var router = require('koa-router')()
var prefix = require('../conf/prefix')
var coupon = require('../controllers/coupon')
var jwt = require('../middlewares/jwt')
var checkJWT = require('../middlewares/clientJwt')

router
	// 获取列表
	.get(`${prefix.api}/coupon/list`, jwt, coupon.fetchList)
	// 查看详情
	.get(`${prefix.api}/coupon/detail/:id`, jwt, coupon.fetchDetail)
	// 添加
	.patch(`${prefix.api}/coupon/detail/:id`, jwt, coupon.update)
	// 添加
	.post(`${prefix.api}/coupon`, jwt, coupon.create)

	// 用户获取列表
	.get(`${prefix.app}/coupon/list`, checkJWT, coupon.appFetchList)


module.exports = router