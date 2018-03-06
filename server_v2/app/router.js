'use strict';

const banner = require('./routers/banner')

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = function(app) {
	const { router, controller } = app;

    banner(router, controller)
};