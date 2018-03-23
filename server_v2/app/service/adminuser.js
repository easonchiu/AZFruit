const Service = require('egg').Service;

class adminuser extends Service {
    
    async find(data) {
        const ctx = this.ctx
        return new Promise(async function(resolve, reject) {
            try {
            	const res = await ctx.model.Adminuser.findOne(data)
            	resolve(res)
            }
            catch (e) {
            	reject('系统错误')
            }
        })
    }
    
}

module.exports = adminuser