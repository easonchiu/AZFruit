var Address = require('../models/address')
var Reg = require('../utils/reg')
var mongoose = require('../conf/mongoose')

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

			if (!body.address) {
				return ctx.error({
					msg: '请输入收货人地址'
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
						address: body.address,
					}
				}
			}

			// 查询地址数量判断是否是用户的第一个地址
			// 如果是，那这条地址肯定是默认地址
			const find = await Address.findOne({
				uid: uid
			}, 'addressList')

			// 设为默认
			if (body.default || !find || !find.addressList.length) {
				newaddress.defaultAddress = addressId
			}
			
			// 存
			const final = await Address.update({
				uid: uid
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

			const find = await Address.findOne({
				uid: uid
			})

			if (!find) {
				return ctx.success({
					data: {
						list: []
					}
				})
			}

			const list = []
			for (let i = 0; i < find.addressList.length; i++) {
				const d = find.addressList[i]
				list.push({
					name: d.name || '',
					mobile: d.mobile || '',
					city: d.city || '',
					address: d.address || '',
					id: d._id
				})
			}

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
			const find = await Address.findOne({
				uid
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
							address: d.address || '',
							default: find.defaultAddress == id,
						}
					}
				}
			}

			if (!res) {
				ctx.error({
					msg: '找不到相关信息'
				})
			} else {
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

			const final = await Address.update({
				uid: uid,
				'addressList._id': id
			}, {
				$pull: {
					addressList: {
						_id: id
					}
				}
			})

			if (final) {
				return ctx.success()
			}
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

			if (!body.address) {
				return ctx.error({
					msg: '请输入收货人地址'
				})
			}
			
			// 更新地址
			const newaddress = {
				$set: {
					'addressList.$': {
						name: body.name,
						mobile: body.mobile,
						address: body.address,
					}
				}
			}

			// 更新默认地址
			if (body.default) {
				newaddress.defaultAddress = body.id
			}
			
			// 存
			const {uid} = ctx.state.jwt

			const final = await Address.update({
				uid: uid,
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
	
}

module.exports = Control