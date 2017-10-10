var router = require('koa-router')()
var prefix = require('../conf/prefix')
var banner = require('../controllers/banner')

router
	// 添加banner
	.post(`${prefix.api}/banner`, banner.create)
	// 删除banner
	.delete(`${prefix.api}/banner/detail/:id`, banner.remove)
	// 获取banner列表
	.get(`${prefix.api}/banner/list`, banner.fetchList)
	// 获取banner详情
	.get(`${prefix.api}/banner/detail/:id`, banner.fetchDetail)
	// 修改banner
	.patch(`${prefix.api}/banner/detail/:id`, banner.update)
	
	// 前端banner列表
	.get(`${prefix.app}/banner/list`, banner.appFetchList)

module.exports = router