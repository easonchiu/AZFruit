import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'
import wx from 'we-jssdk'

import CDN from 'src/assets/libs/cdn'
import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Panel from 'src/auto/panel'
import Loading from 'src/auto/loading'
import Toast from 'src/auto/toast'
import Alert from 'src/auto/alert'
import Popup from 'src/auto/popup'

@connect
@mass(style)
@stateData
class ViewOrder extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			timeout: 0,
			couponPopupVisible: false,
			activeCoupon: ''
		})
	}

	componentDidMount() {
		this.search = qs.parse(this.props.location.search.replace(/^\?/, ''))

		this.fetch(this.search.orderNo, this.search.flag, this.search.couponId, true)

		this.getWxTicket()
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	async fetch(id, flag, couponId = '', first) {
		if (first) {
			this.data.loading = true
		}
		else {
			Loading.show()
		}
		try {
			await this.props.$order.fetchDetail({
				id,
				couponId,
				flag
			})
			const data = this.props.$$order.detail

			this.setState({
				timeout: data.paymentTimeoutSec,
				activeCoupon: data.usedCoupon ? data.usedCoupon.id : ''
			})
			
			if (data.paymentTimeoutSec > 0) {
				clearInterval(this.timer)
				this.timer = setInterval(e => {
					this.setState({
						timeout: this.state.timeout - 1
					}, e => {
						if (this.state.timeout <= 0) {
							clearInterval(this.timer)
						}
					})
				}, 1000)
			}
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
		Loading.hide()
	}

	// 微信获取ticket
	async getWxTicket() {
		try {
			const data = await this.props.$user.getTicket()

			wx.config({
			    debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			    appId: data.appId, // 必填，公众号的唯一标识
			    timestamp: data.timestamp, // 必填，生成签名的时间戳
			    nonceStr: data.nonceStr, // 必填，生成签名的随机串
			    signature: data.signature,// 必填，签名，见附录1
			    jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
			})
		}
		catch (e) {
			console.log(e)
		}
	}

	// 每个单品
	renderGoodsItem = (data, index) => {
		return (
			<div key={index} styleName="goods-item">
				<div styleName="thumb">
					<img src={CDN + data.cover} />
				</div>
				<div styleName="info">
					<h1>
						{data.name}
					</h1>
					<p>
						{data.skuName} 约{Math.round(data.weight/50)/10}斤
					</p>
					<strong>
						￥{data.price / 100}元/{data.unit}
					</strong>
				</div>
				<div styleName="total">
					<p>￥{data.totalPrice / 100}元</p>
					<span>×{data.amount}份</span>
				</div>
			</div>
		)
	}
	
	// 商品列表
	renderGoods = e => {
		const list = this.props.$$order.detail.goodsList || []
		
		if (!list) {
			return null
		}

		return (
			<Panel styleName="goods-list">
				{
					list && list.map((res, i) => this.renderGoodsItem(res, i))
				}
			</Panel>
		)
	}

	// 配送信息
	renderDeliveryInfo() {
		const data = this.props.$$order.detail

		if (!data) {
			return null
		}

		return (
			<Panel styleName="panel">
				<h2>配送信息</h2>
				<ul>
					<li>
						<label>收货人姓名</label>
						<p>{data.name}</p>
					</li>
					<li>
						<label>收货人电话</label>
						<p>
							{
								data.mobile && data.mobile.substr(0,3)
							}
							****
							{
								data.mobile && data.mobile.substr(-4)
							}
						</p>
					</li>
					<li>
						<label>收货地址</label>
						<p>
							{data.area} {data.address}
							<span>{(data.distance / 1000).toFixed(1)}公里</span>
						</p>
					</li>
				</ul>
			</Panel>
		)
	}
	
	// 显示倒计时
	renderTimeout() {
		const m = Math.floor(this.state.timeout / 60)
		const s = ('0' + this.state.timeout % 60).substr(-2)
		if (m > 0) {
			return m + '分钟' + s + '秒'
		}
		return s + '秒'
	}

	// 订单信息
	renderOrderInfo() {
		const data = this.props.$$order.detail

		if (!data) {
			return null
		}

		const status = {
			1: '待支付',
			11: '已支付',
			21: '已发货',
			31: '已完成',
			41: '已评价',
			90: '交易关闭',
		}

		return (
			<Panel styleName="panel">
				<h2>订单信息</h2>
				{
					data.status === 1 ?
					<sup>剩余支付时间：{this.renderTimeout()}</sup> :
					null
				}
				<ul>
					<li>
						<label>订单号</label>
						<p>{data.orderNo}</p>
					</li>
					<li>
						<label>订单状态</label>
						<p>{status[data.status]}</p>
					</li>
					{
						data.status !== 1 &&
						data.status !== 90 ?
						<li>
							<label>支付方式</label>
							<p>微信支付</p>
						</li> :
						null
					}
					{
						data.status !== 1 &&
						data.status !== 90 ?
						<li>
							<label>微信支付订单号</label>
							<p>{data.wxOrderNo}</p>
						</li> :
						null
					}
					{
						data.status !== 90 ?
						<li>
							<label>下单时间</label>
							<p>
								{
									new Date(data.createTime).format('yyyy年MM月dd日 hh:mm:ss')
								}
							</p>
						</li> :
						null
					}
					<li>
						<label>总重量</label>
						<p>{Math.round(data.totalWeight /50)/10}斤</p>
					</li>
					<li>
						<label>金额</label>
						<p>{data.totalPrice / 100}元</p>
					</li>
					<li>
						<label>运费</label>
						<p>
							{
								data.postage > 0 ?
								data.postage / 100 + '元' :
								'免运费'
							}
						</p>
					</li>
					{
						data.status === 1 ?
						<li>
							<label>需支付金额</label>
							<strong>{data.needPayment / 100}元</strong>
						</li> :
						null
					}
					{
						data.status !== 1 &&
						data.status !== 90 ?
						<li>
							<label>支付金额</label>
							<strong>{data.needPayment / 100}元</strong>
						</li> :
						null
					}
				</ul>
			</Panel>
		)
	}

	// 优惠券弹层
	openCouponPopup = e => {
		this.setState({
			couponPopupVisible: true
		})
	}

	closeCouponPopup = e => {
		this.setState({
			couponPopupVisible: false
		})
	}

	// 优惠券点击
	couponClick = couponId => {
		this.search.couponId = couponId
		this.props.history.replace(`/order/detail/?orderNo=${this.search.orderNo}&flag=${this.search.flag}&couponId=${couponId}`)
		this.fetch(this.search.orderNo, this.search.flag, couponId)

		this.closeCouponPopup()
	}

	// 优惠券弹层里优惠券列表
	renderCoupons() {
		const data = this.props.$$order.detail

		if (!data || !data.couponList || !data.couponList.length) {
			return null
		}

		return (
			data.couponList.map(res => (
				<div
					key={res.id}
					styleName={
						cn('item', {
							active: res.id == this.state.activeCoupon
						})
					}
					onClick={
						this.couponClick.bind(this, res.id)
					}
				>
					<i />
					<div styleName="coupon" key={res.id}>
						<h2>{res.name}</h2>
						<p>
							可抵扣{res.worth / 100}元
							{
								res.condition ?
								`（满${res.condition / 100}元可用）` :
								null
							}
						</p>
						<h6>
							{
								res.expiredTime ?
								<span>
									{
										new Date(res.expiredTime).format('使用期限 yyyy年 M月d日前')
									}
								</span> :
								null
							}
							<em>{res.batch}</em>
						</h6>
					</div>
				</div>
			))
		)
	}

	// 减免信息
	renderDiscountInfo() {
		const data = this.props.$$order.detail

		if (!data || !data.usedCoupon) {
			return null
		}

		return (
			<Panel styleName="panel discount-panel">
				<h2>优惠券</h2>
				<a href="javascript:;" onClick={this.openCouponPopup}>
					<label>{data.usedCoupon.name}</label>
					<span>-{data.usedCoupon.worth / 100}元</span>
				</a>
				<Popup
					styleName="coupon-popup"
					visible={this.state.couponPopupVisible}
					height={100}
				>
					<Layout>
						<Layout.Header
							title="选择优惠券"
							addonBefore={
								<a
									href="javascript:;"
									className="close"
									onClick={this.closeCouponPopup}
								/>
							}
						/>
						<Layout.Body>
							{this.renderCoupons()}
						</Layout.Body>
					</Layout>
				</Popup>
			</Panel>
		)
	}
	
	// 取消订单
	cancelOrder = e => {
		Alert.show({
			className: 'cancel-order',
			desc: '确定要取消该订单吗？',
			callbackN: e => {},
			callbackY: async e => {
				Loading.show()
				try {
					const id = this.props.match.params.id
					// 取消订单
					await this.props.$order.cancelOrder(id)
					// 清楚定时器
					clearInterval(this.timer)
					// 提示成功并返回
					Toast.show('订单已成功取消')
					this.props.history.goBack()
				}
				catch (e) {
					console.error(e)
					Toast.show(e.msg)
				}
				Loading.hide()
			},
			btnTextN: '关闭',
			btnTextY: '确定',
		})
	}

	// 支付
	payment = async e => {
		try {
			Loading.show()
			const data = this.props.$$order.detail
			const couponId = data.usedCoupon ? data.usedCoupon.id : ''

			const res = await this.props.$order.paymentOrder({
				orderNo: this.search.orderNo,
				couponId: couponId
			})

			const _this = this

			wx.chooseWXPay({
			    timestamp: res.time_stamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
			    nonceStr: res.nonce_str, // 支付签名随机串，不长于 32 位
			    package: `prepay_id=${res.prepay_id}`, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
			    signType: res.sign_type, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
			    paySign: res.sign, // 支付签名
			    success: function(e){
			        console.log(e)
			    }
			})

			// const params = {
			// 	appId: res.appid, //公众号名称，由商户传入     
			// 	timeStamp: res.time_stamp, //时间戳，自1970年以来的秒数
			// 	nonceStr: res.nonce_str, //随机串     
			// 	package: `prepay_id=${res.prepay_id}`,     
			// 	signType: res.sign_type, //微信签名方式：     
			// 	paySign: res.sign //微信签名 
			// }

			// WeixinJSBridge && WeixinJSBridge.invoke(
			//    'getBrandWCPayRequest', params,
			// 	function(res){     
			// 		if(res.err_msg == "get_brand_wcpay_request:ok" ) {

			// 		}
			// 	}
			// )
		}
		catch (e) {
			Toast.show(e.msg || '系统错误')
		}
		finally {
			Loading.hide()
		}
	}

	render() {
		const data = this.props.$$order.detail

		return (
			<Layout styleName="view-order-detail">
				
				<Layout.Header
					title="订单详情"
					styleName="header"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.props.history.goBack}
						/>
					}
					addonAfter={
						!this.data.loading &&
						this.data.errorInfo === '' &&
						data.status == 1 ?
						<a href="javascript:;"
							styleName="delete"
							onClick={this.cancelOrder}
						>
							取消订单
						</a> :
						null
					}
				/>

				<Layout.Body
					loading={this.data.loading}
					errorInfo={this.data.errorInfo}
					styleName="body"
				>
					
					{this.renderGoods()}

					{this.renderDiscountInfo()}

					{this.renderOrderInfo()}

					{this.renderDeliveryInfo()}

				</Layout.Body>

				<Layout.Footer
					styleName="footer"
					visible={
						!this.data.loading &&
						this.data.errorInfo === ''
					}
				>

					{
						data.status == 1 ?
						<Button onClick={this.payment}>
							微信支付￥{data.needPayment / 100}元
						</Button> :

						data.status == 90 ?
						<Button type="gray">
							订单已取消
						</Button> :

						<Button>
							联系客服
						</Button>
					}
					
				</Layout.Footer>
			</Layout>
		)
	}
}

export default ViewOrder