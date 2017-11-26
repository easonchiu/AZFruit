var WX = require('../conf/wx')
var axios = require('axios')

class Control {

	// 微信获取openid
	static async auth(ctx, next) {
		try {
			const {code} = ctx.request.body

			// 请求微信授权接口
			const res = await axios.request({
				method: 'get',
				url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WX.appID}&secret=${WX.appsecret}&code=${code}&grant_type=authorization_code`
			})
			
			// 如果有错误，报错
			if (res.data.errcode) {
				return ctx.error({
					msg: res.data.errmsg
				})
			}
			// 成功
			else {
				return ctx.success({
					data: {
						openid: res.data.openid
					}
				})
			}
		}
		catch (e) {
			return ctx.error()
		}
	}

}

module.exports = Control