var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var PostageSchema = Schema({
	id: { type: Schema.Types.ObjectId },
	// 超出公里数
	km: { type: Number, required: true },
	// 重量多少以内
	weight: { type: Number, required: true },
	// 运费
	postage: { type: Number, required: true },
	// 递增重量
	eachWeight: { type: Number, default: 500 },
	// 每递增eachWeight增加多少钱
	eachPostage: { type: Number, default: 200 },
	// 满消费免运费
	freePostage: { type: Number, default: 999999 },
	// 使用中
	online: { type: Boolean, default: false },
	// 创建时间
	createTime: { type: Date, default: Date.now }
})

// 创建
PostageSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

// 根据距离、价格、重量计算邮费
PostageSchema.statics.expense = function(distance, price, weight) {
	return new Promise(async (resolve, reject) => {

		// 运费数据库里存的km是千米单位，而地址数据库里存的是米，需要转换
		// 找到小于(等于)实际送货距离并最接近的那个规则
		let postage = await this.aggregate([
			{ $match: { km: { $lte: distance / 1000 }, online: true } },
			{ $sort: { km: -1 } },
			{ $project: { _id: 0, __v: 0 } },
			{ $limit: 1 }
		])
		postage = postage ? postage[0] : postage

		// 如果没有邮费规则，当0元处理
		if (!postage) {
			resolve(0)
		}
		else {
			let postagePrice = 0

			// 如果总价小于免邮费标准，需要付钱
			// 如果freePostage = 0，说明买多少都要收运费
			if (price < postage.freePostage || postage.freePostage == 0) {
				// 首先邮费等于基础邮费
				postagePrice = postage.postage
				
				// 如果超重，需要另加费用
				if (weight > postage.weight && postage.weight > 0) {
					// 计算超出多少重量
					const overflowWeight = Math.abs(weight - postage.weight)

					// 计算超出几档
					const offset = postage.eachWeight > 0 ?
						Math.ceil(overflowWeight / postage.eachWeight) : 0

					// 几档 x 每档价格
					const offsetPrice = offset * postage.eachPostage

					// 把这部分价格加到邮费上
					postagePrice += offsetPrice
				}
			}

			resolve(postagePrice)
		}

	})
}

const model = mongoose.model('Postage', PostageSchema)
module.exports = model