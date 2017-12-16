var UserModel = require('../models/user')
var Reg = require('../utils/reg')
var mongoose = require('../conf/mongoose')
var amapLocation = require('../utils/amapLocation')
var amapDistance = require('../utils/amapDistance')

class Control {
	
	/* 
	 * 添加地址
	 */
	static async add(ctx, next) {
		try {
			const body = ctx.request.body
			const {uid} = ctx.state.jwt
			
			// 检查
			if (!body.name) {
				return ctx.error({
					msg: '收货人姓名不能为空'
				})
			}

			if (!Reg.isMobile(body.mobile)) {
				return ctx.error({
					msg: '请输入正确的手机手机号码'
				})
			}

			if (!body.area) {
				return ctx.error({
					msg: '请选择小区'
				})
			}

			if (!body.address) {
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

			// 手动生成objectId，如果需要设置成默认时直接采用
			const addressId = new mongoose.Types.ObjectId()
			
			// 新地址
			const newaddress = {
				$push: {
					addressList: {
						_id: addressId,
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

			// 设为默认
			if (body.default || !find || !find.addressList.length) {
				newaddress.defaultAddress = addressId
			}
			
			// 存
			const final = await UserModel.update({
				_id: uid
			}, newaddress, {
				upsert: true
			})
			
			if (final) {
				ctx.success()
			}
			else {
				ctx.error()
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
				list.push({
					name: d.name || '',
					mobile: d.mobile || '',
					city: d.city || '',
					area: d.area || '',
					areaAddress: d.areaAddress || '',
					address: d.address || '',
					id: d._id
				})
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

			const id = ctx.params.id

			if (!id) {
				ctx.error({
					msg: '地址id为空'
				})
			}
			
			// 找到这个用户的所有地址
			const find = await UserModel.findOne({
				_id: uid
			})
			
			// 找到相应的那一条地址
			let res = null
			if (find && find.addressList) {
				for (let i = 0; i < find.addressList.length; i++) {
					const d = find.addressList[i]
					if (d._id == id) {
						res = {
							id,
							name: d.name || '',
							mobile: d.mobile || '',
							area: d.area || '',
							areaAddress: d.areaAddress || '',
							address: d.address || '',
							default: find.defaultAddress == id,
						}
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
				'addressList._id': id
			}, {
				$pull: {
					addressList: {
						_id: id
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

	// 更新地址
	static async update(ctx, next) {
		try {
			const body = ctx.request.body
			
			// 检查
			if (!body.id) {
				return ctx.error({
					msg: 'id不能为空'
				})
			}

			if (!body.name) {
				return ctx.error({
					msg: '收货人姓名不能为空'
				})
			}

			if (!Reg.isMobile(body.mobile)) {
				return ctx.error({
					msg: '请输入正确的手机手机号码'
				})
			}

			if (!body.area) {
				return ctx.error({
					msg: '请选择小区'
				})
			}

			if (!body.address) {
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
			
			// 更新地址
			const newaddress = {
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

			// 更新默认地址
			if (body.default) {
				newaddress.defaultAddress = body.id
			}
			
			// 存
			const {uid} = ctx.state.jwt

			const final = await UserModel.update({
				_id: uid,
				'addressList._id': body.id
			}, newaddress)

			if (final) {
				ctx.success()
			}
			else {
				ctx.error()
			}
			
		} catch(e) {
			ctx.error()
		}
	}

	// 获取地址，如果id不对则返回默认地址
	static getAddressById(uid, aid, def) {
		return new Promise(async (resolve, reject) => {
			// 查找相应的地址
			const address = await UserModel.findOne({
				_id: uid
			})
			
			// 如果用户有地址数据，匹配
			let choosedAddress = null

			if (address && address.addressList) {
				let defaultAddress = null
				for (let i = 0; i < address.addressList.length; i++) {
					const d = address.addressList[i]
					// 如果有选择地址，返回选择的
					if (aid && d._id == aid) {
						choosedAddress = d
					}
					// 如果没有选择但有默认地址，返回默认地址
					if (d._id == address.defaultAddress) {
						defaultAddress = d
					}
				}
				if (def && !choosedAddress && defaultAddress) {
					choosedAddress = defaultAddress
				}
			} else {
				resolve(null)
			}
			
			// 如果匹配中地址，整理数据
			if (choosedAddress) {
				resolve({
					id: choosedAddress._id,
					city: choosedAddress.city,
					cityCode: choosedAddress.cityCode,
					zipCode: choosedAddress.zipCode,
					name: choosedAddress.name,
					mobile: choosedAddress.mobile,
					area: choosedAddress.area,
					areaAddress: choosedAddress.areaAddress,
					address: choosedAddress.address,
					lat: choosedAddress.lat,
					lon: choosedAddress.lon,
					distance: choosedAddress.distance * 1.2 // 因为取的是直线距离，实际距离肯定是大于它的
				})
			} else {
				resolve(null)
			}
		})
	}

	
	
}

module.exports = Control