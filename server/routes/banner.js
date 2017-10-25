var router = require('koa-router')()
var prefix = require('../conf/prefix')
var banner = require('../controllers/banner')
var jwt = require('../middlewares/jwt')

router
	// 添加banner
	.post(`${prefix.api}/banner`, jwt, banner.create)
	// 删除banner
	.delete(`${prefix.api}/banner/detail/:id`, jwt, banner.remove)
	// 获取banner列表
	.get(`${prefix.api}/banner/list`, jwt, banner.fetchList)
	// 获取banner详情
	.get(`${prefix.api}/banner/detail/:id`, jwt, banner.fetchDetail)
	// 修改banner
	.patch(`${prefix.api}/banner/detail/:id`, jwt, banner.update)
	
	// 前端banner列表
	.get(`${prefix.app}/banner/list`, banner.appFetchList)

module.exports = router