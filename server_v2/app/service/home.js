const Service = require('egg').Service;

class home extends Service {
	async test(val) {
		return this.ctx.model.Banner.find({})
	}

	async test2() {
		return this.ctx.model.Banner.find({}, {
			_id: 0,
			__v: 0
		})
	}
}

module.exports = home