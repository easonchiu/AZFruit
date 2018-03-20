'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
    router.get(prefix + '/banner/list', controller.banner.list)
    router.post(prefix + '/banner', controller.banner.save)
    router.patch(prefix + '/banner/detail/:id', controller.banner.update)
    router.get(prefix + '/banner/detail/:id', controller.banner.getById)
    router.delete(prefix + '/banner/detail/:id', controller.banner.deleteById)
}

module.exports = router