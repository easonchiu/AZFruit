var router = require('koa-router')()
var prefix = require('../conf/prefix')
var b_category = require('../controllers/b.category')
var f_category = require('../controllers/f.category')
var jwt = require('../middlewares/jwt')

router
	// 添加分类
	.post(`${prefix.api}/category`, jwt, b_category.save)
	// 删除分类
	.delete(`${prefix.api}/category/detail/:id`, jwt, b_category.remove)
	// 修改分类
	.patch(`${prefix.api}/category/detail/:id`, jwt, b_category.save)
	// 获取分类列表
	.get(`${prefix.api}/category/list`, jwt, b_category.fetchList)
	// 获取使用中的分类列表
	.get(`${prefix.api}/category/onlinelist`, jwt, b_category.fetchOnlineList)
	// 获取分类详情
	.get(`${prefix.api}/category/detail/:id`, jwt, b_category.fetchDetail)

	// 用户端获取列表
	.get(`${prefix.app}/category/list`, f_category.fetchList)
	
module.exports = router