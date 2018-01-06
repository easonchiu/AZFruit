var UserModel = require('../models/user')
var Reg = require('../utils/reg')
var mongoose = require('../conf/mongoose')
var amapLocation = require('../utils/amapLocation')
var amapDistance = require('../utils/amapDistance')

class Control {
	
	/* 
	 * 保存地址
	 */
	static async save(ctx, next) {
		try {
			const body = ctx.request.body
			const { uid } = ctx.state.jwt
			const { method } = ctx.request

			// 如果patch请求，更新，先查有没有这条数据
			if (method === 'PATCH') {
				// 先检查有没有传id
				if (!body.id) {
					return ctx.error({
						msg: 'id不能为空'
					})
				}
				// 如果有id，检查是不是有这条数据
				else {
					const doc = await UserModel.findOne({
						_id: uid,
						'addressList.id': body.id
					})

					if (!doc) {
						return ctx.error({
							msg: '该地址不存在'
						})
					}
				}
			}
			
			// 检查body参数
			if (!body.name) {
				return ctx.error({
					msg: '收货人姓名不能为空'
				})
			}
			else if (!Reg.isMobile(body.mobile)) {
				return ctx.error({
					msg: '请输入正确的手机手机号码'
				})
			}
			else if (!body.area) {
				return ctx.error({
					msg: '请选择小区'
				})
			}
			else if (!body.address) {
				return ctx.error({
					msg: '请输入门牌号(例2号楼201室)'
				})
			}

			// 获取经纬度
			const locationInfo = await amapLocation(body.areaAddress)

			if (!locationInfo || !locationInfo.location) {
				return ctx.error({
					msg: '小区地址不够详细'
				})
			}
			
			const location = locationInfo.location.split(',')

			// 获取直线距离
			const distanceInfo = await amapDistance(location[0], location[1])
			if (!distanceInfo.distance) {
				return ctx.error({
					msg: '距离计算失败'
				})
			}

			// 如果是更新
			if (body.id && method === 'PATCH') {
				// 更新地址
				const newaddressSql = {
					$set: {
						'addressList.$.name': body.name,
						'addressList.$.mobile': body.mobile,
						'addressList.$.area': body.area,
						'addressList.$.areaAddress': body.areaAddress,
						'addressList.$.lat': location[0],
						'addressList.$.lon': location[1],
						'addressList.$.distance': distanceInfo.distance,
						'addressList.$.address': body.address
					}
				}

				// 如果要更新默认地址
				if (body.default) {
					newaddressSql.defaultAddress = body.id
				}

				// 将地址存进文档
				const doc = await UserModel.update({
					_id: uid,
					'addressList.id': body.id
				}, newaddressSql)

				if (doc) {
					ctx.success()
				}
				else {
					ctx.error()
				}
			}
			// 新建
			else {
				// 手动生成objectId，如果需要设置成默认时直接采用
				const addressId = new mongoose.Types.ObjectId()
				
				// 新地址
				const newaddressSql = {
					$push: {
						addressList: {
							id: addressId,
							name: body.name,
							mobile: body.mobile,
							area: body.area,
							areaAddress: body.areaAddress,
							lat: location[0],
							lon: location[1],
							distance: distanceInfo.distance,
							address: body.address,
						}
					}
				}
				
				// 查询地址数量判断是否是用户的第一个地址
				// 如果是，那这条地址肯定是默认地址
				const find = await UserModel.findOne({
					_id: uid
				}, 'addressList')

				// 如果指定为默认地址，或者用户的地址中没有数据，这条设为默认
				if (body.default || !find || !find.addressList.length) {
					newaddressSql.defaultAddress = addressId
				}

				// 将新地址存进文档
				const doc = await UserModel.update({
					_id: uid
				}, newaddressSql, {
					upsert: true
				})
				
				if (doc) {
					ctx.success()
				}
				else {
					ctx.error()
				}

			}
		} catch(e) {
			ctx.error()
		}
	}

	// 获取地址列表
	static async fetchList(ctx, next) {
		try {
			const {uid} = ctx.state.jwt
			
			// 查找用户的地址表
			const find = await UserModel.findOne({
				_id: uid
			})
			
			// 如果没找到，返回空数据
			if (!find) {
				return ctx.success({
					data: {
						list: []
					}
				})
			}
			
			// 如果有找到，整理数据
			const list = []
			for (let i = 0; i < find.addressList.length; i++) {
				const d = find.addressList[i]
				list.push(d)
			}
			
			// 返回整理后的数据与默认地址的id
			ctx.success({
				data: {
					list,
					default: find.defaultAddress,
				}
			})
		} catch(e) {
			ctx.error()
		}
	}

	// 获取地址详情
	static async fetchDetail(ctx, next) {
		try {
			const {uid} = ctx.state.jwt
			let id = ctx.params.id

			if (!id) {
				ctx.error({
					msg: '地址id为空'
				})
			}
			
			// 找到这个用户的所有地址
			const doc = await UserModel.findOne({
				_id: uid
			})

			// 如果查的是默认地址
			if (id === 'default') {
				id = doc.defaultAddress
			}
			
			// 找到相应的那一条地址
			let res = null
			if (doc && doc.addressList) {
				for (let i = 0; i < doc.addressList.length; i++) {
					const d = doc.addressList[i]
					if (d.id == id) {
						res = {
							id,
							name: d.name || '',
							mobile: d.mobile || '',
							area: d.area || '',
							areaAddress: d.areaAddress || '',
							address: d.address || '',
							distance: d.distance * 1.2, // 因为取的是直线距离，实际距离肯定是大于它的
							default: doc.defaultAddress == id,
						}
						break
					}
				}
			}

			// 如果没找到相关的地址信息，报错
			if (!res) {
				ctx.error({
					msg: '找不到相关信息'
				})
			}
			// 否则，返回地址信息
			else {
				ctx.success({
					data: res
				})
			}
		} catch(e) {
			ctx.error()
		}
	}

	// 删除地址
	static async remove(ctx, next) {
		try {
			const id = ctx.request.body.id

			if (!id) {
				return ctx.error({
					msg: 'id不能为空'
				})
			}

			const {uid} = ctx.state.jwt
			
			// 找到并删除相关的那条地址信息
			const res = await UserModel.update({
				_id: uid,
				'addressList.id': id
			}, {
				$pull: {
					addressList: {
						id: id
					}
				}
			})
			
			// 如果删除成功，返回成功
			if (res) {
				return ctx.success()
			}
			// 否则报错
			else {
				return ctx.error()
			}
		} catch(e) {
			ctx.error()
		}
	}

	
}

module.exports = Control