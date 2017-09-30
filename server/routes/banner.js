var router = require('koa-router')()
var prefix = require('../conf/prefix')
var banner = require('../controllers/banner')

router
	.prefix(`${prefix}/banner`)
	// 添加banner
	.post('/', banner.create)
	// 获取banner
	.get('/', banner.read)
	// 修改banner
	.patch('/', banner.update)
	// 删除banner
	.delete('/', banner.delete)

module.exports = router