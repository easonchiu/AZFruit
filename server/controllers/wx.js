var WX = require('../conf/wx')
var axios = require('axios')

class Control {

	static async authCallback(ctx, next) {
		try {
			let { code, state } = ctx.query

			// 请求微信授权接口
			const res = await axios.request({
				method: 'get',
				url: `https://api.weixin.qq.com/sns/oauth2/access_token?appid=${WX.appID}&secret=${WX.appsecret}&code=${code}&grant_type=authorization_code`
			})
			
			// 如果有错误，报错
			if (res.data.errcode) {
				return ctx.body = '授权异常'
			}
			// 成功，302到首页
			else {
				ctx.redirect('http://localhost:1234/#/?openid=' + res.data.openid)
			}
		}
		catch (e) {
			return ctx.body = '授权异常'
		}
	}

}

module.exports = Control