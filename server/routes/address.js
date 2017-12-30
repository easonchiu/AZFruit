var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_address = require('../controllers/f.address')
var clientJWT = require('../middlewares/clientJwt')

router
	// 添加地址
	.post(`${prefix.app}/address`, clientJWT, f_address.save)
	// 获取地址列表
	.get(`${prefix.app}/address`, clientJWT, f_address.fetchList)
	// 获取地址详情
	.get(`${prefix.app}/address/:id`, clientJWT, f_address.fetchDetail)
	// 修改地址
	.patch(`${prefix.app}/address`, clientJWT, f_address.save)
	// 删除某个地址
	.delete(`${prefix.app}/address`, clientJWT, f_address.remove)
	
module.exports = router