var router = require('koa-router')()
var prefix = require('../conf/prefix')
var f_banner = require('../controllers/f.banner')
var b_banner = require('../controllers/b.banner')
var jwt = require('../middlewares/jwt')

router
	// 添加banner
	.post(`${prefix.api}/banner`, jwt, b_banner.save)
	// 删除banner
	.delete(`${prefix.api}/banner/detail/:id`, jwt, b_banner.remove)
	// 获取banner列表
	.get(`${prefix.api}/banner/list`, jwt, b_banner.fetchList)
	// 获取banner详情
	.get(`${prefix.api}/banner/detail/:id`, jwt, b_banner.fetchDetail)
	// 修改banner
	.patch(`${prefix.api}/banner/detail/:id`, jwt, b_banner.save)
	
	// 前端banner列表
	.get(`${prefix.app}/banner/list`, f_banner.fetchList)

module.exports = router