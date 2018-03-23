'use strict';

const adminuser = require('./routers/adminuser')
const banner = require('./routers/banner')
const category = require('./routers/category')
const coupon = require('./routers/coupon')
const goods = require('./routers/goods')
const postage = require('./routers/postage')
const quick = require('./routers/quick')
const sku = require('./routers/sku')
const upload = require('./routers/upload')

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = function(app) {
	const { router, controller } = app
    
    adminuser(router, controller)
    banner(router, controller)
    category(router, controller)
    coupon(router, controller)
    goods(router, controller)
    postage(router, controller)
    quick(router, controller)
    sku(router, controller)
    upload(router, controller)
    
}