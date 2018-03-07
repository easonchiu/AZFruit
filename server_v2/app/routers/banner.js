'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
    router.post(prefix.api + '/banner', controller.banner.save)
    router.patch(prefix.api + '/banner', controller.banner.update)
    router.get(prefix.api + '/banner/:id', controller.banner.getById)
    router.delete(prefix.api + '/banner/:id', controller.banner.deleteById)
}

module.exports = router