import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

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
class ViewOrderDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			timeout: 0,
		})
	}

	componentDidMount() {
		this.search = qs.parse(this.props.location.search.replace(/^\?/, ''))
		
		// 微信获取ticket
		this.props.$user.getTicketAndConf()

		this.fetch(this.search.id, this.search.flag)
	}

	componentWillUnmount() {
		clearInterval(this.timer)
	}

	async fetch(id, flag) {
		this.data.loading = true
		try {
			await this.props.$order.fetchDetail({
				id,
				flag
			})
			const data = this.props.$$order.detail

			// 如果是带支付的订单，每次进来都查一次状态
			if (data.status == 11) {
				await this.props.$order.queryStatus({
					orderNo: data.orderNo
				})
			}

			this.setState({
				timeout: data.paymentTimeout
			})
			
			if (data.paymentTimeout > 0) {
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
		finally {
			this.data.loading = false
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
						￥{data.price / 100}元 / {data.unit}
					</strong>
				</div>
				<div styleName="total">
					<p>￥{data.totalPrice / 100}元</p>
					<span>× {data.amount}份</span>
				</div>
			</div>
		)
	}
	
	// 商品列表
	renderGoods = e => {
		const list = this.props.$$order.detail.list || []
		
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

		if (!data || !data.address) {
			return null
		}

		return (
			<Panel styleName="panel">
				<h2>配送信息</h2>
				<ul>
					<li>
						<label>收货人姓名</label>
						<p>{data.address.name}</p>
					</li>
					<li>
						<label>收货人电话</label>
						<p>
							{
								data.address.mobile && data.address.mobile.substr(0,3)
							}
							****
							{
								data.address.mobile && data.address.mobile.substr(-4)
							}
						</p>
					</li>
					<li>
						<label>收货地址</label>
						<p>
							{data.address.area} {data.address.address}
							<span>{(data.address.distance / 1000).toFixed(1)}公里</span>
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
							<strong>{data.paymentPrice / 100}元</strong>
						</li> :
						null
					}
					{
						data.status !== 1 &&
						data.status !== 90 ?
						<li>
							<label>支付金额</label>
							<strong>{data.paymentPrice / 100}元</strong>
						</li> :
						null
					}
				</ul>
			</Panel>
		)
	}

	// 减免信息
	renderDiscountInfo() {
		const data = this.props.$$order.detail

		if (!data || !data.coupon) {
			return null
		}

		return (
			<Panel styleName="panel discount-panel">
				<h2>优惠券</h2>
				<div>
					<label>{data.coupon.name}</label>
					<span>-{data.coupon.worth / 100}元</span>
				</div>
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
					// 取消订单
					await this.props.$order.cancelOrder(this.search.id)
					// 清除定时器
					clearInterval(this.timer)
					// 提示成功并返回
					Toast.show('订单已成功取消')
					this.props.history.goBack()
					this.props.$order.fetchAmount()
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

			const res = await this.props.$order.paymentOrder({
				id: this.search.id
			})

			// 唤起微信支付
			function onBridgeReady() {
				WeixinJSBridge.invoke(
					'getBrandWCPayRequest', res,
					function(res) {
						if(res.err_msg == "get_brand_wcpay_request:ok" ) {
							window.location.reload()
						}
					}
				)
			}
			if (typeof WeixinJSBridge == "undefined") {
				document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false)
			} else {
				onBridgeReady()
			}
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
							微信支付￥{data.paymentPrice / 100}元
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

export default ViewOrderDetail