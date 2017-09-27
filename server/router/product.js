var router = require('koa-router')()
var prefix = require('../conf/prefix')
var product = require('../controllers/product')

router
	.prefix(`${prefix}/product`)
	.get('/add', product.add)

module.exports = router