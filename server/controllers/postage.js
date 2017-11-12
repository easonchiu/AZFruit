var Postage = require('../models/postage')

class Control {
	
	/* 
	 * 创建运费
	 *
	 * !@km 超出距离
	 * !@weight 多少重量以内，单位：克
	 * !@postage 运费，单位：分
	 * @eachWeight 递增重量
	 * @eachPostage 每份重量加价
	 * @freePostage 满消费免运费
	 * @online 规则使用中
	 *
	 */
	static async create(ctx, next) {
		const body = ctx.request.body

		if (!(/^[0-9]*$/g).test(body.km)) {
			return ctx.error({
				msg: '超出距离不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.weight)) {
			return ctx.error({
				msg: '重量不能为空'
			})
		}

		if (!(/^[0-9]*$/g).test(body.postage)) {
			return ctx.error({
				msg: '基础运费不能为空'
			})
		}
		
		try {
			await Postage.create({
				km: body.km,
				weight: body.weight,
				postage: body.postage,
				eachWeight: body.eachWeight,
				eachPostage: body.eachPostage,
				freePostage: body.freePostage,
				online: body.online,
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 更新运费
	static async update(ctx, next) {
		try {
			const { id } = ctx.params
			
			let find = await Postage.findOne({
				_id: id
			})

			if (!find) {
				return ctx.error({
					msg: '该规则不存在'
				})
			}

			const body = ctx.request.body

			if (!(/^[0-9]*$/g).test(body.km)) {
				return ctx.error({
					msg: '超出距离不能为空'
				})
			}

			if (!(/^[0-9]*$/g).test(body.weight)) {
				return ctx.error({
					msg: '重量不能为空'
				})
			}

			if (!(/^[0-9]*$/g).test(body.postage)) {
				return ctx.error({
					msg: '基础运费不能为空'
				})
			}

			await Postage.update({
				_id: id
			}, body)

			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}

	// 删除
	static async remove(ctx, next) {
		try {
			const { id } = ctx.params
			await Postage.remove({
				_id: id
			})
			return ctx.success()
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 获取运费列表
	static async fetchList(ctx, next) {
		try {
			let { skip = 0, limit = 10 } = ctx.query
			skip = parseInt(skip)
			limit = parseInt(limit)

			const count = await Postage.count({})
			let list = []

			if (count > 0) {
				list = await Postage
					.aggregate([{
						$sort: {
							online: -1,
							km: 1
						}
					}, {
						$project: {
							_id: 0,
							km: 1,
							weight: 1,
							postage: 1,
							eachWeight: 1,
							eachPostage: 1,
							freePostage: 1,
							online: 1,
							id: '$_id'
						}
					}, {
						$skip: skip
					}, {
						$limit: limit
					}])
			}

			return ctx.success({
				data: {
					list,
					count,
					skip,
					limit,
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}

	// 获取运费详情
	static async fetchDetail(ctx, next) {
		try {
			const { id } = ctx.params

			const res = await Postage.findOne({
				_id: id
			})

			return ctx.success({
				data: {
					km: res.km,
					weight: res.weight,
					postage: res.postage,
					eachWeight: res.eachWeight,
					eachPostage: res.eachPostage,
					freePostage: res.freePostage,
					online: res.online,
					id: id
				}
			})
		} catch(e) {
			return ctx.error()
		}
	}
	
	// 根据距离、价格、重量计算邮费
	static countPostage(distance, price, weight) {
		return new Promise(async (resolve, reject) => {

			// 运费数据库里存的km是千米单位，而地址数据库里存的是米，需要转换
			// 找到小于(等于)实际送货距离并最接近的那个规则
			const postages = await Postage
				.find({
					km: {
						$lte: distance / 1000
					}
				})
				.sort({
					'km': -1
				})
				.limit(1)
			
			// 如果没有邮费规则，当0元处理
			if (!postages || postages.length == 0) {
				reject('找不到相关的邮费规则')
			}
			else {
				const data = postages[0]
				let postagePrice = 0

				// 如果总价小于免邮费标准，需要付钱
				// 如果freePostage = 0，说明买多少都要收运费
				if (price < data.freePostage || data.freePostage == 0) {
					// 首先邮费等于基础邮费
					postagePrice = data.postage
					

					// 如果超重，需要另加费用
					if (weight > data.weight && data.weight > 0) {
						// 计算超出多少重量
						const overflowWeight = Math.abs(weight - data.weight)

						// 计算超出几档
						const offset = data.eachWeight > 0 ?
							Math.ceil(overflowWeight / data.eachWeight) : 0

						// 几档 x 每档价格
						const offsetPrice = offset * data.eachPostage

						// 把这部分价格加到邮费上
						postagePrice += offsetPrice
					}
				}

				resolve(postagePrice)
			}

		})
	}
	
}

module.exports = Control