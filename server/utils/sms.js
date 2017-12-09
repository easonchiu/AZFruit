var axios = require('axios')

const url = 'http://sms.3wxt.cn/servlet/SendSMS'
const u = 'zs00486'
const p = 'b21cb14eba74c1ed773636dfec98a5b4'

class Sms {
	// 发送短信验证码
	static async sendVerifcode(mobile) {
		// 生成验证码
		const code = this.randomCreator(6)

		// 发送验证码
		return this._sendSms(mobile, '您的验证码为：' + code, code)
	}

	static async _sendSms(mobile, content, callback_res) {
		return new Promise(async (resolve, reject) => {
			// 发验证码短信
			axios.request({
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				method: 'post',
				url: url,
				params: {
					username: u,
					password: p,
					method: 'single',
					mobiles: mobile,
					contents: content
				}
			}).then(res => {
				if (res.data && res.data.split(',')[0] == '111') {
					resolve(callback_res)
				} else {
					reject()
				}
			}).catch(err => {
				reject()
			})
		})
	}

	// 随机数
	static randomCreator(len) {
		var num = ''
		for (var i = 0; i < len; i++) {
		  num += '' + Math.floor(Math.random() * 10)
		}
		return num
	}
}




module.exports = Sms