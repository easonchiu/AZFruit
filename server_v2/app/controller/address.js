const Controller = require('egg').Controller;

class Address extends Controller {
	/**
     * m.获取地址列表
     */
    async m_list(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const data = await ctx.service.user.getById(uid)
            let addressList = data.addressList || []

            return ctx.success({
                data: {
                    list: addressList,
                    default: data.defaultAddress
                }
            })
        } catch(e) {
            return ctx.error(e)
        }
    }
    
    /**
     * m.添加地址
     */
    async m_create(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            await ctx.service.address.create(uid, body, true)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.更新地址
     */
    async m_update(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            await ctx.service.address.create(uid, body, false)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }

    /**
     * m.删除地址
     */
    async m_remove(ctx) {
        try {
            const { uid } = ctx.jwt || {}
            const { body } = ctx.request
            await ctx.service.address.remove(uid, body.id)

            return ctx.success()
        }
        catch (e) {
            return ctx.error(e)
        }
    }
    
    /**
     * m.获取地址详情
     */
    async m_detail(ctx) {
        try {
            const { id } = ctx.params
            const { uid } = ctx.jwt || {}
            const isDefault = id === 'default' // 如果id为default，表示默认地址

            const data = await ctx.service.user.getById(uid)
            let addressList = data.addressList || []

            let address = {}
            if (id) {
                addressList.forEach(res => {
                    if (isDefault) {
                        if (res.id === data.defaultAddress) {
                            address = res
                        }
                    }
                    else if (res.id === id) {
                        address = res
                    }
                })
            }
            
            return ctx.success({
                data: address
            })
        } catch(e) {
            return ctx.error(e)
        }
    }
}

module.exports = Address