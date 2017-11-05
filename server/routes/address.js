var router = require('koa-router')()
var prefix = require('../conf/prefix')
var address = require('../controllers/address')
var checkJWT = require('../middlewares/clientJwt')

router
	// 添加地址
	.post(`${prefix.app}/address`, checkJWT, address.add)
	// 获取地址列表
	.get(`${prefix.app}/address/list`, checkJWT, address.fetchList)
	// 获取地址详情
	.get(`${prefix.app}/address/detail/:id`, checkJWT, address.fetchDetail)
	// 修改地址
	.patch(`${prefix.app}/address`, checkJWT, address.update)
	// 删除某个地址
	.delete(`${prefix.app}/address`, checkJWT, address.remove)
	
module.exports = router