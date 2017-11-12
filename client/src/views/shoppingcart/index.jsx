import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import cn from 'classnames'
import {Link} from 'react-router-dom'

import CDN from 'src/assets/libs/cdn'
import Layout from 'src/auto/layout'
import Loading from 'src/auto/loading'
import Toast from 'src/auto/toast'
import Alert from 'src/auto/alert'
import Button from 'src/auto/button'
import AppFooter from 'src/components/appFooter'

@connect
@mass(style)
@stateData
class ViewShoppingcart extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			edited: '',
			amount: 0,
			maxAmount: 0
		})
	}

	componentDidMount() {
		this.fetchData()
	}

	async fetchData(patchData) {
		// patchData为更新的产品内容，用于修改购物车内容时，更新完立刻再拉取最新数据
		if (!patchData) {
			this.data.loading = true
		} else {
			Loading.show()
		}
		try {
			if (typeof patchData == 'object') {
				await this.props.$shoppingcart.update(patchData)
			}
			const aid = this.props.match.params.aid
			await this.props.$shoppingcart.fetchList({
				addressId: aid
			})
		} catch(e) {
			console.error(e)
			if (!patchData) {
				this.data.errorInfo = e.msg
			} else {
				Toast.show(e.msg)
			}
		}
		this.setState({
			edited: '',
			loading: false
		})
		Loading.hide()
	}
	
	// 编辑
	edit = res => {
		this.setState({
			edited: res.id,
			amount: res.amount,
			maxAmount: res.stock
		})
	}
	
	// 减少购买数量
	minus = e => {
		if (this.data.amount > 1) {
			this.data.amount--
		}
	}
	
	// 增加购买数量
	add = e => {
		if (this.data.amount < Math.min(this.data.maxAmount, 9)) {
			this.data.amount++
		}
	}

	// 保存
	save = async res => {
		if (res.stock < this.data.amount) {
			Toast.show('库存不足，您最多可购买' + res.stock + '件')
			return false
		}
		else if (res.amount !== this.data.amount) {
			this.fetchData({
				id: res.id,
				amount: this.data.amount
			})
		}
		this.data.edited = ''
	}

	// 删除
	delete = async res => {
		Alert.show({
			className: 'delete',
			desc: '确定要删除<' + res.name + '-' + res.specName + '>吗？',
			btnTextN: '取消',
			btnTextY: '删除',
			callback: async e => {
				try {
					await this.props.$shoppingcart.remove({
						id: res.id
					})
					await this.props.$shoppingcart.fetchAmount()
					this.fetchData(true)
				} catch(e) {
					Toast.show(e.msg)
				}
			}
		})
	}

	// 更换地址
	changeAddress = e => {
		const aid = this.props.match.params.aid
		if (aid) {
			this.props.history.push('/address/choose/' + aid)
		} else {
			this.props.history.push('/address/choose')
		}
	}

	renderAddress() {
		const address = this.props.$$shoppingcart.address
		if (!address) {
			return (
				<div styleName="address empty">
					<p>您还没有收货地址哦~</p>
					<Button onClick={e => this.props.history.push('/address/create/first')}>创建地址</Button>
				</div>
			)
		}

		return (
			<div styleName="address">
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
			</div>
		)
	}

	renderList() {
		const list = this.props.$$shoppingcart.list
		
		// 产品的信息，以及数量操作功能
		const renderInfo = res => (
			<div styleName="info">
				{
					this.data.edited == res.id ?
					<div styleName="tools">
						<a href="javascript:;"
							styleName={this.data.amount <= 1 ? 'disabled' : ''}
							onClick={this.minus}>﹣</a>
						<span>{this.data.amount}</span>
						<a href="javascript:;"
							styleName={this.data.amount >= Math.min(this.data.maxAmount, 9) ? 'disabled' : ''}
							onClick={this.add}>﹢</a>
						<a href="javascript:;" styleName="delete"
							onClick={this.delete.bind(this, res)}>删除</a>
					</div> :
					null
				}
				<h1>
					{res.name}
				</h1>
				<p>
					{res.specName} 约{Math.round(res.weight/50)/10}斤
				</p>
				<strong>
					￥{res.price / 100}元/{res.unit}
				</strong>
			</div>
		)
		
		// 产品上架中的状态，显示总价，数量之类的
		const renderOnline = res => (
			<div styleName="item-total">
				{
					res.stock < res.amount ?
					<p>库存仅{res.stock}件</p> :
					<p>￥{res.totalPrice / 100}元</p>
				}
				<span>×{res.amount}份</span>
				{
					this.data.edited == '' ?
					<a href="javascript:;"
						styleName={res.stock < res.amount ? '' : 'normal'}
						onClick={this.edit.bind(this, res)}>
						{
							res.stock < res.amount ?
							'修改数量' :
							'编辑'
						}
					</a> :
					this.data.edited == res.id ?
					<a href="javascript:;"
						styleName="save"
						onClick={this.save.bind(this, res)}>保存</a> :
					null
				}
			</div>
		)
		
		// 产品下架后，显示删除按钮
		const renderOffline = res => (
			<div styleName="item-status">
				<p>已下架</p>
				{
					this.data.edited == '' ?
					<a href="javascript:;"
						onClick={this.delete.bind(this, res)}>删除</a> :
					null
				}
			</div>
		)
		
		return (
			<div styleName="list">
			{
				list.map(res => {
					return (
						<div key={res.id} styleName={cn('item', {
							error: (!res.online || res.stock < res.amount) && this.data.edited != res.id
						})}>
							<div styleName="thumb">
								<img src={CDN+res.cover} />
							</div>
							{
								renderInfo(res)
							}
							{
								res.online ?
								renderOnline(res) :
								renderOffline(res)
							}
						</div>
					)
				})
			}
			</div>
		)
	}

	backClick = e => {
		this.props.history.push('/')
	}

	payment = async aid => {
		Loading.show()
		try {
			await this.props.$order.create({
				addressid: aid
			})
		} catch(e) {
			Toast.show(e.msg)
		}
		Loading.hide()
	}

	render() {
		const {
			totalPrice = 0,
			postagePrice = 0,
			totalWeight = 0,
			address = {}
		} = this.props.$$shoppingcart

		return (
			<Layout styleName="view-shoppingcart">
				<Layout.Header title="购物车"
					addonBefore={<a href="javascript:;" className="back" onClick={this.backClick} />} />

				<Layout.Body
					styleName="body"
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
					
					{this.renderAddress()}
					
					{this.renderList()}
					
				</Layout.Body>

				<Layout.Footer
					styleName="footer"
					visible={!this.data.loading && !this.data.errorInfo && totalPrice != 0}>
					
					<div styleName="total">
						{
							postagePrice > 0 ?
							<em>
								总重量约{Math.round(totalWeight/50)/10}斤，运费另收￥{postagePrice / 100}元
							</em> :
							<em>
								总重量约{Math.round(totalWeight/50)/10}斤，免运费
							</em>
						}
						<p>
							<span>总计：￥</span>
							<strong>{(totalPrice + postagePrice) / 100}</strong>
							<span>元</span>
						</p>
					</div>

					<Button disabled={!address.id}
						onClick={this.payment.bind(this, address.id)}>
						结算
					</Button>
				</Layout.Footer>
			</Layout>
		)
	}
}

export default ViewShoppingcart