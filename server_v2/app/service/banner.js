const Service = require('egg').Service;

class home extends Service {

    /**
	 * 保存banner
     */
	async save(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 检查data的参数
            if (!data.uri) {
                return reject('图片地址不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.index)) {
                return reject('排序编号不能为空且必须为数字')
            }

            await new ctx.model.Banner(data).create()

            resolve()
        })
	}

    /**
     * 更新banner
     */
    async update(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 检查data的参数
            if (!data.id) {
                return reject('id不能为空')
            }
            else if (!data.uri) {
                return reject('图片地址不能为空')
            }
            else if (!(/^[0-9]*$/g).test(data.index)) {
                return reject('排序编号不能为空且必须为数字')
            }

            await ctx.model.Banner.update({
                _id: id
            }, data)

            resolve()
        })
    }

    /**
	 * 获取
     */
    async getById(id) {
        const ctx = this.ctx
    	return new Promise(async function(resolve, reject) {
    	    if (!id) {
                reject('id不能为空')
            }
            else if (id.length !== 24) {
                reject('id不正确')
            }

            const data = await ctx.model.Banner.findOne({
                _id: id
            }, {
                _id: 0,
                __v: 0
            })

            if (data) {
                resolve(data)
            }
            else {
    	        reject('未找到相关的banner')
            }
		})
	}

    async deleteById(id) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            if (!id) {
                reject('id不能为空')
            }
            else if (id.length !== 24) {
                reject('id不正确')
            }

            const data = await ctx.model.Banner.remove({
                _id: id
            })

            if (data) {
                resolve(data)
            }
            else {
                reject('未找到相关的banner')
            }
        })
    }
}

module.exports = home