var router = require('koa-router')()
var prefix = require('../conf/prefix')
var upload = require('../controllers/upload')
var jwt = require('../middlewares/jwt')

router
	// 取图
	.get(`${prefix.api}/upload/list`, jwt, upload.fetchList)
	// 存图
	.post(`${prefix.api}/upload`, jwt, upload.save)

module.exports = router