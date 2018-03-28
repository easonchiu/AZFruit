const Service = require('egg').Service;

class redis extends Service {

    /**
	 * 创建订单库存缓存
     */
	async setSkuStock(id, stock) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id || !stock) {
                    return resolve()
                }
                
                const key = 'SKU_STOCK.' + id
                await redis.set(key, stock)
                redis.expire(key, 300) // 缓存5分钟

                resolve()
            }
            catch (e) {
                resolve()
            }
        })
    }

    /**
     * 获取订单库存缓存
     */
    async getSkuStock(id) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!id) {
                    return resolve(0)
                }
                
                const key = 'SKU_STOCK.' + id
                const res = await redis.get(key)

                resolve(res)
            }
            catch (e) {
                resolve(0)
            }
        })
    }
    
    /**
     * 保存用户的登录验证码
     */
    async setSmsVerifcode(mobile, code, smskey) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }
                else if (!code || !smskey) {
                    return reject('没有成功生成验证码')
                }
                
                const key = 'VERIF_CODE.' + mobile
                await redis.hset(key, 'code', code, 'smskey', smskey)
                redis.expire(key, 60 * 30) // 30分钟有效

                resolve()
            }
            catch (e) {
                console.log(e)
                reject('系统错误')
            }
        })
    }

    /**
     * 验证用户的登录验证码
     */
    async checkSmsVerifcode(mobile, code, smskey) {
        const redis = this.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查data的参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }
                else if (!smskey) {
                    return reject('请先获取验证码')
                }
                else if (!code) {
                    return reject('请输入验证码')
                }
                
                const key = 'VERIF_CODE.' + mobile
                const resCode = await redis.hget(key, 'code')
                const resSmskey = await redis.hget(key, 'smskey')

                if (!resCode || !resSmskey) {
                    return reject('请先获取验证码')
                }
                else if (resCode !== code || resSmskey !== smskey) {
                    return reject('验证码输入错误')
                }

                // 验证通过
                redis.del(key)

                resolve()
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }
}

module.exports = redis