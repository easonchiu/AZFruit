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
                redis.expire(key, 300) // 缓存5分钟
                await redis.set(key, stock)

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
}

module.exports = redis