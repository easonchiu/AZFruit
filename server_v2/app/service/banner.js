const Service = require('egg').Service;

class home extends Service {

    /**
	 * 保存banner
     */
	async save(data) {
		console.log(data)
		return this.ctx.model.Banner.find({}, {
			_id: 0,
			__v: 0
		})
	}

    /**
     * 更新banner
     */
    async update(data) {
        return this.ctx.model.Banner.find({}, {
            _id: 0,
            __v: 0
        })
    }

    /**
	 * 获取
     */
    async get(id) {
    	return new Promise(async function(resolve, reject) {
            reject({
				message: '123334'
			})

            const data = await this.ctx.model.Banner.find({}, {
                _id: 0,
                __v: 0
            })
            resolve(data)
		})
	}
}

module.exports = home