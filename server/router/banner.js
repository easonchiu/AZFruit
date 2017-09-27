var router = require('koa-router')()
var prefix = require('../conf/prefix')
var banner = require('../controllers/banner')

router
	.prefix(`${prefix}/banner`)
	// 添加banner
	.post('/', banner.add)
	// 获取banner
	.get('/', banner.fetch)
	// 修改banner
	.patch('/', banner.edit)
	// 删除banner
	.delete('/', banner.remove)

module.exports = router