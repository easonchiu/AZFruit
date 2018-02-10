var BannerModel = require('../models/banner')
var cache = require('memory-cache')

class Service {
	
	// 保存banner，有id时为更新，没有则为新建
	static save(id, data, method) {
		return new Promise(async (resolve, reject) => {

			// 如果请求中有传id，更新，先查有没有这条数据
			if (id && method === 'PATCH') {
				const doc = await BannerModel.findById(id)

				if (!doc) {
					return reject('该banner不存在')
				}
			}
			
			// 检查data的参数
			if (!data.uri) {
				return reject('图片地址不能为空')
			}
			else if (!(/^[0-9]*$/g).test(data.index)) {
				return reject('排序编号不能为空且必须为数字')
			}
		
			// 有id，更新
			if (id && method === 'PATCH') {
				await BannerModel.update({
					_id: id
				}, data)
			}
			// 没有id，创建
			else {
				await new BannerModel(data).create()
			}

			resolve()
		})
	}

	// 返回banner数据
	static findById(id) {
		return BannerModel.findOne({
			_id: id
		}, {
			_id: 0,
			__v: 0
		})
	}

	// 删除
	static removeById(id) {
		return BannerModel.remove({
			_id: id
		})
	}

	// 获取列表
	static fetchList(skip = 0, limit = 10) {
		return new Promise(async (resolve, reject) => {
			// 计算条目数量
			const count = await BannerModel.count({})

			// 查找数据
			let list = []
			if (count > 0) {
				list = await BannerModel.aggregate([
					{ $sort: { online: -1, index: 1 } },
					{ $project: { _id: 0, __v: 0 } },
					{ $skip: skip },
					{ $limit: limit }
				])
			}

			resolve({
				list,
				count,
				skip,
				limit
			})
		})
	}

	// 获取在线的列表
	static fetchOnlineList(cacheName) {
		return new Promise(async (resolve, reject) => {
			// 从缓存找数据
			const mc = cache.get(cacheName)
			if (mc) {
				return resolve(mc)
			}

			const list = await BannerModel.aggregate([
				{ $match: { online: true } },
				{ $sort: { index: 1 } },
				{ $project: { _id: 0, __v: 0 } }
			])

			// 1分钟缓存
			cache.put(cacheName, list, 1000 * 60)

			return resolve(list)
		})
	}

}

module.exports = Service