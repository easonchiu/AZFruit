import style from './style'
import React, { PureComponent as Component } from 'react'
import {Link} from 'react-router-dom'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import CDN from 'src/assets/libs/cdn'
import Layout from 'src/auto/layout'
import Panel from 'src/auto/panel'
import Tabs from 'src/auto/tabs'
import Button from 'src/auto/button'

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

	async fetch(type = 1) {
		this.data.loading = true
		try {
			await this.props.$order.fetchList({
				type
			})
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	tabsClick = e => {
		if (this.data.tabsActive !== e) {
			this.props.history.replace(`/order/${e}`)
			this.data.tabsActive = e
			this.fetch(e)
		}
	}

	renderTabs() {
		return (
			<Tabs
				onClick={this.tabsClick}
				active={this.data.tabsActive}
				styleName="header-tabs"
			>
				<Tabs.Item value={1}>进行中</Tabs.Item>
				<Tabs.Item value={2}>已完成</Tabs.Item>
			</Tabs>
		)
	}

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

	itemClick = data => {
		this.props.history.push(`/order/detail/?orderNo=${data.orderNo}&flag=${this.data.tabsActive}`)
	}

	renderItem = data => {
		return (
			<Panel onClick={this.itemClick.bind(this, data)} styleName="item" key={data.orderNo}>
				<div styleName="hd">
					<p>订单号：{data.orderNo}</p>
					<span>待支付</span>
				</div>
				<div className="bd">
					{
						data.goodsList ?
						data.goodsList.map(this.renderGoodsItem) :
						null
					}
				</div>
				<div styleName="ft">
					总计
					{
						data.needPayment > data.totalPrice ?
						'（不含运费）：' :
						'（免运费）：'
					}
					<span>￥{data.totalPrice / 100}元</span>
				</div>
			</Panel>
		)
	}

	render() {
		const data = this.props.$$order.list

		return (
			<Layout styleName="view-order">
				
				<Layout.Header
					title="我的订单"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.props.history.goBack}
						/>
					}
					addonBottom={this.renderTabs()}
				/>

				<Layout.Body
					loading={this.data.loading}
					errorInfo={this.data.errorInfo}>
					
					{
						data.list && data.list.length ?
						<div styleName="list">
						{
							data.list.map(this.renderItem)
						}
						</div> :
						<div styleName="empty">
							<i />
							<p>还没有订单哦~</p>
							<Button onClick={e => this.props.history.push('/')}>
								去逛逛
							</Button>
						</div>
					}

				</Layout.Body>

			</Layout>
		)
	}
}

export default ViewOrder