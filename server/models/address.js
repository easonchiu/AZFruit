var mongoose = require('../conf/mongoose')

// 创建一个schema对象
var Schema = mongoose.Schema

// 创建一个schema实例
var AddressSchema = Schema({
	// 用户id
	uid: {
		type: String,
		default: ''
	},
	// 默认收货地址
	defaultAddress: {
		type: String,
		default: ''
	},
	// 收货地址列表
	addressList: [{
		// 城市，目前只能上海
		city: {
			type: String,
			default: '上海',
			enum: ['上海'],
			required: true
		},
		// 城市编号
		cityCode: {
			type: String,
			default: '310100'
		},
		// 邮编号码
		zipCode: {
			type: String,
			default: '200000'
		},
		// 收货人电话
		mobile: {
			type: String,
			required: true
		},
		// 收货人姓名
		name: {
			type: String,
			required: true
		},
		// 小区（地图选的）
		area: {
			type: String,
			required: true
		},
		// 经度
		lat: {
			type: Number,
			required: true
		},
		// 纬度
		lon: {
			type: Number,
			required: true
		},
		// 直线距离
		distance: {
			type: Number,
			required: true
		},
		// 收货人地址（门牌号部分）
		address: {
			type: String,
			required: true
		}
	}]
})

const model = mongoose.model('Address', AddressSchema)
module.exports = model
