var router = require('koa-router')()
var prefix = require('../conf/prefix')
var b_upload = require('../controllers/b.upload')
var jwt = require('../middlewares/jwt')

router
	// 取图
	.get(`${prefix.api}/upload/list`, jwt, b_upload.fetchList)
	// 存图
	.post(`${prefix.api}/upload`, jwt, b_upload.save)

module.exports = router