var router = require('koa-router')()
var prefix = require('../conf/prefix')
var category = require('../controllers/category')
var jwt = require('../middlewares/jwt')

router
	// 添加分类
	.post(`${prefix.api}/category`, jwt, category.create)
	// 删除分类
	.delete(`${prefix.api}/category/detail/:id`, jwt, category.remove)
	// 修改分类
	.patch(`${prefix.api}/category/detail/:id`, jwt, category.update)
	// 获取分类列表
	.get(`${prefix.api}/category/list`, jwt, category.fetchList)
	// 获取使用中的分类列表
	.get(`${prefix.api}/category/onlinelist`, jwt, category.fetchOnlineList)
	// 获取分类详情
	.get(`${prefix.api}/category/detail/:id`, jwt, category.fetchDetail)

	// 用户端获取列表
	.get(`${prefix.app}/category/list`, category.appFetchList)
	
module.exports = router