const Service = require('egg').Service;

const axios = require('axios')
const key = require('../conf/sms')

class sms extends Service {

    /**
	 * 发送短信验证码
     */
	async sendVerifcode(mobile) {
        const th = this
        const ctx = th.ctx
        const redis = th.app.redis
        return new Promise(async function(resolve, reject) {
            try {
                // 检查参数
                if (!mobile) {
                    return reject('请输入手机号')
                }
                else if (!(/1\d{10}/).test(mobile)) {
                    return reject('请输入正确的手机号')
                }

                // 生成验证码
                const code = th._randomCreator(6)

                // 这里需要加一个判断不能连续发短信

                // 生成随机码
                const smskey = Math.random().toString(33).substr(2, 10)
                
                // 将验证码缓存到redis
                await ctx.service.redis.setSmsVerifcode(mobile, code, smskey)

                // 发送验证码
                await th.sendSms(mobile, '您的验证码为：' + code)

                resolve({
                    smskey
                })
            }
            catch (e) {
                reject('系统错误')
            }
        })
    }

    // 生成随机数
    _randomCreator(len) {
        var num = ''
        for (var i = 0; i < len; i++) {
          num += '' + Math.floor(Math.random() * 10)
        }
        return num
    }
    
    /**
     * 发送短信
     */
    async sendSms(mobile, content) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            // 发验证码短信
            axios.request({
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'post',
                url: key.url,
                params: {
                    username: key.u,
                    password: key.p,
                    method: 'single',
                    mobiles: mobile,
                    contents: content
                }
            }).then(res => {
                if (res.data && res.data.split(',')[0] === '111') {
                    resolve()
                } else {
                    reject()
                }
            }).catch(err => {
                reject()
            })
        })
    }
}

module.exports = sms