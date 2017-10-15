var router = require('koa-router')()
var prefix = require('../conf/prefix')
var upload = require('../controllers/upload')

router
	// 取图
	.get(`${prefix.api}/upload/list`, upload.fetchList)
	// 存图
	.post(`${prefix.api}/upload`, upload.save)

module.exports = router