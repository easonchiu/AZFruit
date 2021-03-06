/*
* @ use 统一响应请求中间件
* @ error-data 返回错误时，可携带的数据
* @ error-msg  自定义的错误提示信息
* @ error-code 错误返回码 401为用户未授权 2为普通错误看msg提示
* @ error-errdata 可返回服务器生成的错误
* @ success-data  请求成功时响应的数据
* @ success-msg  请求成功时响应的提示信息
* @ succrss-code 1为返回成功
* @ 调用ctx.error()   响应错误
* @ 调用ctx.success()  响应成功
*/ 

module.exports = e => async (ctx, next) => {
    ctx.error = (res = {}) => {
        if (res === 401) {
            ctx.status = 401
            ctx.body = {
                code: 401,
                msg: '请重新登录',
            }
        }
        else if (typeof(res) === 'string') {
            ctx.body = {
                code: 2,
                msg: res,
            }
        }
        else if (res && res.message) {
            ctx.body = {
                code: 3,
                msg: res.message,
            }
        }
        else {
            const SERVER_ERROR = 'server error'
            let { data, msg = SERVER_ERROR, code } = res
            if (code === undefined) {
                if (msg != SERVER_ERROR) {
                    code = 1
                } else {
                    code = 500
                }
            }
            ctx.body = { code, msg, data }
        }
    }

    ctx.success = (res = {}) => {
    	const { data, msg = 'success' } = res
        ctx.body = { code: 0, msg, data }
    }
    await next()
}