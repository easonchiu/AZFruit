var router = require('koa-router')()
var prefix = require('../conf/prefix')
var banner = require('../controllers/banner')

router
	.prefix(`${prefix}/banner`)
	// 添加banner
	.post('/', banner.create)
	// 获取banner列表
	.get('/list', banner.fetchList)
	// 获取banner详情
	.get('/detail/:id', banner.fetchDetail)
	// 修改banner
	.patch('/detail/:id', banner.update)

module.exports = router