'use strict';

module.exports = appInfo => {
	const config = exports = {};

	// use for cookie sign key, should change to your own and keep security
	config.keys = appInfo.name + '_1518578566417_9336';

	// add your config here
	config.middleware = ['response'];

	// mongoose
	config.mongoose = {
		url: 'mongodb://ivcsun:QwEaSdZxC123@47.100.22.250:24324/ivcsun',
		options: {}
	};

	return config;
};