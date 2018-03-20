'use strict';

const banner = require('./routers/banner')
const adminuser = require('./routers/adminuser')

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = function(app) {
	const { router, controller } = app;

    banner(router, controller)
    adminuser(router, controller)
};