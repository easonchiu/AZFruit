var router = require('koa-router')()
var prefix = require('../conf/prefix')
var control = require('../controllers/class')

router
	// 添加分类
	.post(`${prefix.api}/class`, control.create)
	// 删除分类
	.delete(`${prefix.api}/class/detail/:id`, control.remove)
	// 修改分类
	.patch(`${prefix.api}/class/detail/:id`, control.update)
	// 获取分类列表
	.get(`${prefix.api}/class/list`, control.fetchList)
	// 获取使用中的分类列表
	.get(`${prefix.api}/class/onlinelist`, control.fetchOnlineList)
	// 获取分类详情
	.get(`${prefix.api}/class/detail/:id`, control.fetchDetail)
	
module.exports = router