// 订单的定时任务
var schedule = require('node-schedule')
var dateFormat = require('dateformat')


var OrderModel = require('../models/order')
var OrderControl = require('../controllers/b.order')
var UserModel = require('../models/user')
var SkuModel = require('../models/sku')
var WXPay = require('../middlewares/wx')


// 清理超时没支付，或被手动关闭的订单
var taskOvertimeOrder = async () => {
	console.log('---------------------')
	console.log(dateFormat(new Date(), 'yyyy-mm-dd, H:MM:ss'), '清理超时没支付，或被手动关闭的订单')
	const res = await OrderModel.find({
		$or: [{
			paymentTimeout: {
				$lt: new Date()
			},
			status: 1
		}, {
			status: 90
		}]
	})

	for (let i = 0; i < res.length; i++) {
		try {
			// 删之前再查询一次订单状态
			const wxres = await WXPay.orderQuery({
				out_trade_no: res[i].orderNo
			})

			// 如果支付成功，处理状态，不往下走
			if (wxres.trade_state == 'SUCCESS' && wxres.cash_fee) {
				await OrderControl.orderFinishPayment(wxres.out_trade_no, wxres.transaction_id)
			}
		}
		catch (e) {
			// 说明订单未支付
			if (e && e.message == 'ORDERNOTEXIST') {
				// 删除订单
				await OrderModel.remove({
					_id: res[i].id
				})

				// 解锁商品
				const goods = res[i].list
				if (goods.length) {
					await SkuModel.revertStock(goods)
				}
				
				// 解锁优惠券
				const coupon = res[i].coupon ? res[i].coupon.id : ''
				if (coupon) {
					await UserModel.update({
						_id: res[i].uid,
						'couponList.id': coupon
					}, {
						$set: {
							'couponList.$.locked': false
						}
					})
				}
				
				
			}
		}
	}
	console.log('---------------------')
}


// 定时器(每1分钟)
var task = () => {
	var rule = new schedule.RecurrenceRule()
	rule.second = [30] // 每分钟的第30秒
	schedule.scheduleJob(rule, function(){  
		taskOvertimeOrder()
	})

}

module.exports = task