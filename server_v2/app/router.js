'use strict';

const home = require('./routers/home')

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
	const { router, controller } = app;
	
	home(router, controller)
};