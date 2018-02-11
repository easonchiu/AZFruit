var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var CouponSchema = Schema({
	id: { type: String },
	// 名称
	name: { type: String, required: true },
	// 批次号
	batch: { type: String, required: true },
	// 数量
	amount: { type: Number, default: 0 },
	// 已发放数量
	handOutAmount: { type: Number, default: 0 },
	// 已使用数量
	usedAmount: { type: Number, default: 0 },
	// 价值，即可抵扣金额
	worth: { type: Number, default: 0 },
	// 使用条件，满足金额数
	condition: { type: Number, default: 0 },
	// 发放方式
	flag: { type: Number, default: 0 },
	// 是否使用中
	online: { type: Boolean, default: false },
	// 过期时间，（几天后过期）
	expiredTime: { type: Number },
	// 创建时间
	createTime: { type: Date, default: Date.now }
})

// 创建
CouponSchema.methods.create = function() {
	this.id = this._id
	return this.save()
}

// 使用，计数
CouponSchema.statics.countUsed = function(id) {
	return new Promise(async resolve => {
		await this.update({
			_id: id
		}, {
			$inc: {
				usedAmount: 1
			}
		})
		resolve()
	})
}

// 注册完成时获得优惠券
// 注意：该方法调用就已经加上已发放数量了
CouponSchema.statics.getCouponWhenRegisterSuccess = function() {
	return new Promise(async resolve => {
		// 获取下单即获取的优惠券
		const couponDoc = await this.find({
			flag: 1,
			online: true
		}, {
			__v: 0,
			_id: 0
		})
		
		// 声明结果数组
		const list = []

		// 处理优惠券
		for (let i = 0; i < couponDoc.length; i++) {
			const data = couponDoc[i]

			// 如果还有没发完的优惠券，给该用户
			if (data.handOutAmount < data.amount) {
				// 计算过期时间
				let date = (new Date().getTime()) + 60 * 60 * 1000 * 24 * data.expiredTime
				date = new Date(date)
				date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59)
				
				list.push({
					id: new mongoose.Types.ObjectId(),
					originId: data.id,
					name: data.name,
					batch: data.batch + '_' + (data.handOutAmount + 1),
					condition: data.condition,
					worth: data.worth,
					expiredTime: date
				})

				// 已发放数量+1
				await this.update({
					_id: data.id
				}, {
					$inc: {
						handOutAmount: 1
					}
				})
			}
		}
		resolve(list)
	})
}

const model = mongoose.model('Coupon', CouponSchema)
module.exports = model