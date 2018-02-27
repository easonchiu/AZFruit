'use strict';

const router = (router, controller) => {
	router.get('/', controller.home.index)
}

module.exports = router