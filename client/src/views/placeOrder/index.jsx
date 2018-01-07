import style from './style'
import React, { PureComponent as Component } from 'react'
import {Link} from 'react-router-dom'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import CDN from 'src/assets/libs/cdn'
import Layout from 'src/auto/layout'
import Panel from 'src/auto/panel'
import Tabs from 'src/auto/tabs'
import Button from 'src/auto/button'
import Loading from 'src/auto/loading'
import Popup from 'src/auto/popup'
import Toast from 'src/auto/toast'

@connect
@mass(style)
@stateData
class ViewOrder extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			disabled: true,
			couponPopupVisible: false
		})

		this.search = qs.parse(props.location.search.replace(/^\?/, ''))
	}

	componentDidMount() {
		this.fetch(this.props.match.params.aid, this.search.coupon, true)
	}

	async fetch(aid, cid = 1, first) {
		if (first) {
			this.data.loading = true
		}
		else {
			Loading.show()
		}
		try {
			// 获取地址信息
			if (aid) {
				await this.props.$address.fetchDetail({
					id: aid,
					distance: 1
				})
			}
			else {
				await this.props.$address.fetchDefault({
					distance: 1
				})
			}

			// 得到请求回来的地址
			const address = this.props.$$address.detail

			// 获取购物车内的商品
			await this.props.$shoppingcart.fetchList({
				distance: address.distance,
				coupon: cid
			})
			
			// 如果没有内容
			const list = this.props.$$shoppingcart.list
			if (!list.length) {
				this.props.$shoppingcart.clearAmount()
			}
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		finally {
			this.data.loading = false
			Loading.hide()
		}
	}

	// 更换地址
	changeAddress = e => {
		const aid = this.props.match.params.aid
		const coupon = this.props.$$shoppingcart.choosedCoupon ? '?coupon=' + this.props.$$shoppingcart.choosedCoupon.id : ''
		
		if (aid) {
			this.props.history.push('/address/choose/' + aid + coupon)
		} else {
			this.props.history.push('/address/choose' + coupon)
		}
	}

	renderAddress() {
		if (this.data.loading) {
			return null
		}
		const address = this.props.$$address.detail

		if (!address) {
			return (
				<Panel styleName="address empty">
					<p>您还没有收货地址哦~</p>
					<Button onClick={e => this.props.history.push('/address/create/first')}>
						创建地址
					</Button>
				</Panel>
			)
		}

		return (
			<Panel styleName="address">
				<h6>收货人：{address.name}<span>{address.mobile}</span></h6>
				<a href="javascript:;"
					onClick={this.changeAddress}
					styleName="change">
					更换地址
				</a>
				<div styleName="location">
					<p>{address.area} {address.address}</p>
					<em>{(address.distance/1000).toFixed(1)}公里</em>
				</div>
			</Panel>
		)
	}

	submit = async e => {
		Loading.show()
		try {
			const address = this.props.$$address.detail || {}
			const coupon = this.props.$$shoppingcart.choosedCoupon ? this.props.$$shoppingcart.choosedCoupon : {}

			const orderNo = await this.props.$order.create({
				addressId: address.id,
				couponId: coupon.id
			})

			this.props.$shoppingcart.clearAmount()
			this.props.$order.fetchAmount()
			this.props.history.replace(`/order/detail/?id=${orderNo}&flag=1`)
		}
		catch (e) {
			Toast.show(e.msg || '系统错误')
		}
		finally {
			Loading.hide()
		}
	}

	renderList() {
		const list = this.props.$$shoppingcart.list

		return (
			<Panel styleName="list">
				<h2>商品清单</h2>
				{
					list.map(res => {
						return (
							<div key={res.skuId} styleName="item">
								<div styleName="thumb">
									<img src={CDN+res.cover} />
								</div>
								<div styleName="info">
									<h1>
										{res.name}
									</h1>
									<p>
										{res.skuName} 约{Math.round(res.weight/50)/10}斤
									</p>
									<strong>
										￥{res.price / 100}元/{res.unit}
									</strong>
								</div>
								<div styleName="total">
									<p>￥{res.totalPrice / 100}元</p>
									<span>×{res.amount}份</span>
								</div>
							</div>
						)
					})
				}
			</Panel>
		)
	}

	renderFooter() {
		const {
			totalPrice = 0,
			totalWeight = 0,
			postage = 0
		} = this.props.$$shoppingcart

		return (
			<div styleName="footer">
				<div styleName="total">
					<p>
						<span>总计：￥</span>
						<strong>{totalPrice / 100}</strong>
						<span>元</span>
					</p>
					<em>
						总重量约{Math.round(totalWeight / 50) / 10}斤，
						{
							postage ?
							`运费${postage / 100}元` :
							'免运费'
						}
					</em>
				</div>

				<Button onClick={this.submit}>
					提交订单
				</Button>
			</div>
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
	couponClick = coupon => {
		this.search.coupon = coupon
		const aid = this.props.match.params.aid
		if (aid) {
			this.props.history.replace(`/placeOrder/${aid}?coupon=${coupon}`)
		}
		else {
			this.props.history.replace(`/placeOrder?coupon=${coupon}`)
		}
		this.fetch(aid, coupon)
		this.closeCouponPopup()
	}

	// 优惠券弹层里优惠券列表
	renderCoupons() {
		const data = this.props.$$shoppingcart

		if (!data || !data.couponList || !data.couponList.length) {
			return null
		}

		const active = data.choosedCoupon ? data.choosedCoupon.id : ''

		return (
			data.couponList.map(res => (
				<div
					key={res.id}
					styleName={
						cn('item', {
							active: res.id == active
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
		const data = this.props.$$shoppingcart

		if (!data || !data.choosedCoupon) {
			return null
		}

		return (
			<Panel styleName="coupon">
				<h2>优惠券</h2>
				<a href="javascript:;" onClick={this.openCouponPopup}>
					<label>{data.choosedCoupon.name}</label>
					<span>-{data.choosedCoupon.worth / 100}元</span>
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

	render() {
		const { list } = this.props.$$shoppingcart

		return (
			<Layout styleName="view-place-order">
				
				<Layout.Header
					title="确认订单"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={e => this.props.history.replace('/shoppingcart')}
						/>
					}
				/>

				<Layout.Body
					styleName="body"
					loading={this.data.loading}
					errorInfo={this.data.errorInfo}
				>

					{this.renderAddress()}

					{this.renderDiscountInfo()}
					
					{this.renderList()}

				</Layout.Body>

				{
					!this.data.loading &&
					!this.data.errorInfo &&
					list.length > 0 ?
					this.renderFooter() :
					null
				}

			</Layout>
		)
	}
}

export default ViewOrder