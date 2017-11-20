import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import CDN from 'src/assets/libs/cdn'
import Layout from 'src/auto/layout'
import Tabs from 'src/auto/tabs'
import AppFooter from 'src/components/appFooter'
import NavSpct from 'src/components/navSpct'

@connect
@mass(style)
@stateData
class ViewOrder extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			tabsActive: 1,
		})
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$order.fetchList()
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	tabsClick = e => {
		this.data.tabsActive = e
	}

	renderTabs() {
		return (
			<Tabs onClick={this.tabsClick}
				active={this.data.tabsActive}
				styleName="header-tabs">
				<Tabs.Item value={1}>全部</Tabs.Item>
				<Tabs.Item value={2}>已完成</Tabs.Item>
			</Tabs>
		)
	}

	renderProductItem = (data, index) => {
		return (
			<div key={index} styleName="product-item">
				<div styleName="thumb">
					<img src={CDN + data.cover} />
				</div>
				<div styleName="info">
					<h1>
						{data.name}
					</h1>
					<p>
						{data.specName} 约{Math.round(data.weight/50)/10}斤
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

	renderItem = data => {
		console.log(data)
		return (
			<div styleName="item" key={data.orderNo}>
				<div styleName="hd">
					<p>订单号：{data.orderNo}</p>
					<span>待支付</span>
				</div>
				<div className="bd">
					{
						data.productList ?
						data.productList.map(this.renderProductItem) :
						null
					}
				</div>
				<div styleName="ft">
					总计：<span>￥{data.totalPrice / 100}元</span>
				</div>
			</div>
		)
	}

	render() {
		const data = this.props.$$order.list

		return (
			<Layout styleName="view-order">
				
				<Layout.Header
					title="我的订单"
					addonAfter={<NavSpct />}
					addonBottom={this.renderTabs()} />

				<Layout.Body
					loading={this.data.loading}
					errorInfo={this.data.errorInfo}>
					
					{
						data.list ?
						<div styleName="list">
						{
							data.list.map(this.renderItem)
						}
						</div> :
						null
					}

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewOrder