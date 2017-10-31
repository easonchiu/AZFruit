import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import cn from 'classnames'

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
			count: 0,
			maxCount: 0
		})
	}

	componentDidMount() {
		this.fetchData()
	}

	async fetchData(patchData) {
		if (!patchData) {
			this.data.loading = true
		} else {
			Loading.show()
		}
		try {
			if (typeof patchData == 'object') {
				await this.props.$shoppingcart.update(patchData)
			}
			await this.props.$shoppingcart.fetchList()
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
			count: res.count,
			maxCount: res.stock
		})
	}
	
	// 减少购买数量
	minus = e => {
		if (this.data.count > 1) {
			this.data.count--
		}
	}
	
	// 增加购买数量
	add = e => {
		if (this.data.count < Math.min(this.data.maxCount, 9)) {
			this.data.count++
		}
	}

	// 保存
	save = async res => {
		if (res.stock < this.data.count) {
			Toast.show('库存不足，您最多可购买' + res.stock + '件')
			return false
		}
		else if (res.count !== this.data.count) {
			this.fetchData({
				id: res.id,
				count: this.data.count
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
					await this.props.$shoppingcart.count()
					this.fetchData(true)
				} catch(e) {
					Toast.show(e.msg)
				}
			}
		})
	}

	renderAddress() {
		// return (
		// 	<div styleName="address empty">
		// 		<p>您还没有收货地址哦~</p>
		// 		<Button>创建地址</Button>
		// 	</div>
		// )
		return (
			<div styleName="address">
				<h6>收货人：赵志达<span>18201938590</span></h6>
				<a href="javascript:;" styleName="change">更换地址</a>
				<div styleName="location">
					<p>上海市宝山区虎林路800弄2号201室</p>
					<em>16.5公里</em>
				</div>
			</div>
		)
	}

	renderList() {
		const list = this.props.$$shoppingcart.list
		
		return (
			<div styleName="list">
			{
				list.map(res => {
					return (
						<div key={res.id} styleName={cn('item', {
							error: (!res.online || res.stock < res.count) && this.data.edited != res.id
						})}>
							<div styleName="thumb">
								<img src={CDN+res.cover} />
							</div>
							<div styleName="info">
								{
									this.data.edited == res.id ?
									<div styleName="tools">
										<a href="javascript:;"
											styleName={this.data.count <= 1 ? 'disabled' : ''}
											onClick={this.minus}>﹣</a>
										<span>{this.data.count}</span>
										<a href="javascript:;"
											styleName={this.data.count >= Math.min(this.data.maxCount, 9) ? 'disabled' : ''}
											onClick={this.add}>﹢</a>
										<a href="javascript:;" styleName="delete"
											onClick={this.delete.bind(this, res)}>删除</a>
									</div> :
									null
								}
								<h1>{res.name}<br />{res.specName}</h1>
								<strong>
									￥{res.price / 100}元/{res.unit}
								</strong>
							</div>
							{
								res.online ?
								<div styleName="item-total">
									{
										res.stock < res.count ?
										<p>库存仅{res.stock}件</p> :
										<p>￥{res.totalPrice / 100}元</p>
									}
									<span>×{res.count}份</span>
									{
										this.data.edited == '' ?
										<a href="javascript:;"
											styleName={res.stock < res.count ? '' : 'normal'}
											onClick={this.edit.bind(this, res)}>
											{
												res.stock < res.count ?
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
								</div> :
								<div styleName="item-status">
									<p>已下架</p>
									{
										this.data.edited == '' ?
										<a href="javascript:;"
											onClick={this.delete.bind(this, res)}>删除</a> :
										null
									}
								</div>
							}
							
						</div>
					)
				})
			}
			</div>
		)
	}

	backClick = e => {
		this.props.history.goBack()
	}

	payment = e => {
		alert('生成订单')
	}

	render() {
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

				<Layout.Footer styleName="footer">
					<div styleName="total">
						<p>
							<span>总计：￥</span>
							<strong>{this.props.$$shoppingcart.totalPrice / 100}</strong>
							<span>元</span>
						</p>
						<em>含运费￥20元</em>
					</div>
					<Button onClick={this.payment}>结算</Button>
				</Layout.Footer>
			</Layout>
		)
	}
}

export default ViewShoppingcart