var router = require('koa-router')()
var prefix = require('../conf/prefix')
var b_postage = require('../controllers/b.postage')
var jwt = require('../middlewares/jwt')

router
	// 添加运费
	.post(`${prefix.api}/postage`, jwt, b_postage.save)
	// 删除运费
	.delete(`${prefix.api}/postage/detail/:id`, jwt, b_postage.remove)
	// 修改运费
	.patch(`${prefix.api}/postage/detail/:id`, jwt, b_postage.save)
	// 获取运费列表
	.get(`${prefix.api}/postage/list`, jwt, b_postage.fetchList)
	// 获取运费详情
	.get(`${prefix.api}/postage/detail/:id`, jwt, b_postage.fetchDetail)
	
module.exports = router