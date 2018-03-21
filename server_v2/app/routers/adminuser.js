'use strict';

const prefix = require('../../config/prefix')

const router = function (router, controller) {
    // 初始化
    router.post(`${prefix}/adminuser`, controller.adminuser.create)
    // 登录
    router.post(`${prefix}/adminuser/login`, controller.adminuser.login)
}

module.exports = router