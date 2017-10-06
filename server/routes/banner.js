var router = require('koa-router')()
var prefix = require('../conf/prefix')
var banner = require('../controllers/banner')

router
	.prefix(`${prefix.api}`)
	// 添加banner
	.post('/banner', banner.create)
	// 获取banner列表
	.get('/banner/list', banner.fetchList)
	// 获取banner详情
	.get('/banner/detail/:id', banner.fetchDetail)
	// 修改banner
	.patch('/banner/detail/:id', banner.update)
	// 前端banner列表
	.get(`${prefix.app}/banner/list`, banner.appFetchList)

module.exports = router