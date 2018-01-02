var jwt = require('jsonwebtoken')
var jwtKey = require('../conf/clientJwtKey')
var WX = require('../conf/wx')
var axios = require('axios')
var UserModel = require('../models/user')
var OrderModel = require('../models/order')

class Control {

	static async authCallback(ctx, next) {
		try {
			let { code, state, redirect, token } = ctx.query
			
			if (!token || !redirect) {
				return ctx.body = '参数错误'
			}
			
			// 解析jwt
			const userInfo = jwt.verify(token, jwtKey)

			// 请求微信授权接口
			const res = await axios.request({
				method: 'get',
				url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WX.appID}&secret=${WX.appsecret}&code=${code}&grant_type=authorization_code`
			})
			
			// 如果有错误，报错
			if (res.data.errcode) {
				return ctx.body = '授权异常'
			}
			// 成功，将openid更新到用户表，然后302返回
			else {
				await UserModel.update({
					_id: userInfo.uid
				}, {
					openId: res.data.openid
				})
				ctx.redirect(decodeURIComponent(redirect))
			}
		}
		catch (e) {
			return ctx.body = '授权异常'
		}
	}

	static async unifiedorderCallback(ctx, next) {
		try {
			const {id} = ctx.request.body

			let doc = await OrderModel.aggregate([
				{ $match: { orderNo: id } },
				{ $project: { _id: 0, __v: 0 } },
				{ $limit: 1 }
			])
			
			// 找到这个订单
			if (doc && doc.length) {
				doc = doc[0]
			}
			else {
				return ctx.error()
			}

			// 查找相关的订单将其改成支付完成状态
			doc.status = 11
			
			// 存入微信订单号
			doc.wxOrderNo = 'test'
			
			// 存到历史订单表中
			await new OrderModel.history(doc).create()

			// 删除原表中的订单
			await OrderModel.remove({
				orderNo: id
			})

			return ctx.success()
		}
		catch (e) {
			console.log(e)
			return ctx.error()
		}
	}

}

module.exports = Control