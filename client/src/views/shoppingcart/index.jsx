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
import Panel from 'src/auto/panel'
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
			maxAmount: 0,
			disabled: false
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
			// 如果有修改操作，先修改购物车内的商品
			if (typeof patchData == 'object') {
				await this.props.$shoppingcart.update(patchData)
			}
			
			// 获取购物车内的商品
			await this.props.$shoppingcart.fetchList()
			
			// 如果没有内容
			const list = this.props.$$shoppingcart.list
			if (!list.length) {
				this.props.$shoppingcart.clearAmount()
			}
			// 判断每个商品的库存是不是够
			else {
				let disabled = false
				for (let i = 0; i < list.length; i++) {
					const d = list[i]
					if (d.amount > d.stock) {
						disabled = true
						break
					}
				}
				this.data.disabled = disabled
			}
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
			edited: res.skuId,
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
				id: res.skuId,
				amount: this.data.amount
			})
		}
		this.data.edited = ''
	}

	// 删除
	delete = async res => {
		Alert.show({
			className: 'delete',
			desc: '确定要删除<' + res.name + '-' + res.skuName + '>吗？',
			btnTextN: '取消',
			btnTextY: '删除',
			callback: async e => {
				try {
					await this.props.$shoppingcart.remove({
						id: res.skuId
					})
					await this.props.$shoppingcart.fetchAmount()
					this.fetchData(true)
				} catch(e) {
					Toast.show(e.msg)
				}
			}
		})
	}

	renderList() {
		const list = this.props.$$shoppingcart.list
		
		// 产品的信息，以及数量操作功能
		const renderInfo = res => (
			<div styleName="info">
				{
					this.data.edited == res.skuId ?
					<div styleName="tools">
						<a href="javascript:;"
							styleName={
								this.data.amount <= 1 ?
								'disabled' :
								''
							}
							onClick={this.minus}>﹣</a>
						<span>{this.data.amount}</span>
						<a href="javascript:;"
							styleName={
								this.data.amount >= Math.min(this.data.maxAmount, 9) ?
								'disabled' :
								''
							}
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
					{res.skuName}
					{' '}
					{
						res.weight < 500 ?
						`约${res.weight}克` :
						`约${Math.round(res.weight/50)/10}斤`
					}
				</p>
				<strong>
					￥{res.price / 100}元 / {res.unit}
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
				<span>× {res.amount}份</span>
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
					this.data.edited == res.skuId ?
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
			<Panel styleName="list">
			{
				list.map(res => {
					return (
						<div key={res.skuId} styleName={cn('item', {
							error: (!res.online || res.stock < res.amount) && this.data.edited != res.skuId
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
			</Panel>
		)
	}

	submit = async () => {
		Loading.show()
		try {
			this.props.history.push(`/placeOrder`)
		}
		catch(e) {
			Toast.show(e.msg)
		}
		finally {
			Loading.hide()
		}
	}

	renderFooter() {
		const {
			totalPrice = 0,
			totalWeight = 0,
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
						总重量约{Math.round(totalWeight / 50) / 10}斤
					</em>
				</div>

				<Button onClick={this.submit} disabled={this.data.disabled}>
					下一步
				</Button>
			</div>
		)
	}

	render() {
		const { list } = this.props.$$shoppingcart

		return (
			<Layout styleName="view-shoppingcart">
				<Layout.Header title="购物车" />

				<Layout.Body
					styleName="body"
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
					
					{
						list.length ?
						this.renderList() :
						null
					}

					{
						!list.length ?
						<div styleName="empty-tips">
							<i />
							<p>购物车中没有东西哦~</p>
							<Button onClick={e => this.props.history.push('/')}>
								去逛逛
							</Button>
						</div> :
						null
					}
					
				</Layout.Body>

				{
					!this.data.loading &&
					!this.data.errorInfo &&
					list.length > 0 ?
					this.renderFooter() :
					null
				}

				<AppFooter pathname={this.props.location.pathname} />
			</Layout>
		)
	}
}

export default ViewShoppingcart