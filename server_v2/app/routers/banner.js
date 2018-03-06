'use strict';

const router = function (router, controller) {

    router.post('/', controller.banner.save)
    router.patch('/', controller.banner.save)
    router.get('/', controller.banner.save)
}

module.exports = router