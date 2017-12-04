import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import { Link } from 'react-router-dom'
import stateData from 'react-state-data'
import mass from 'mass'

import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Cell from 'src/auto/cell'
import Tabs from 'src/auto/tabs'

@connect
@mass(style)
@stateData
class ViewCoupon extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			tabsActive: 1,
		})
	}

	backClick = e => {
		this.props.history.goBack()
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$coupon.fetchList()
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	tabsClick = e => {
		if (this.data.tabsActive !== e) {
			this.props.history.replace(`/coupon/${e}`)
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
				<Tabs.Item value={1}>未使用</Tabs.Item>
				<Tabs.Item value={2}>已使用</Tabs.Item>
			</Tabs>
		)
	}

	render() {
		const data = this.props.$$coupon.list

		return (
			<Layout styleName="view-coupon">
				
				<Layout.Header
					title="优惠券"
					addonBefore={
						<a
							href="javascript:;"
							className="back"
							onClick={this.backClick}
						/>
					}
					addonBottom={
						this.renderTabs()
					}
				/>

				<Layout.Body
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
					
					{
						data.length ?
						<div styleName="list">
							{
								data.map(res => (
									<div
										styleName={
											res.used ? 'item used' : 'item'
										}
										key={res._id}>
										<h2>{res.name}</h2>
										<p>
											可抵扣{res.worth}元
											{
												res.condition ?
												`（满200元可用）` :
												null
											}
										</p>
										<h6>
											<span>使用期限 {res.expiredTime}</span>
											<em>{res.batch}</em>
										</h6>
									</div>
								))
							}
						</div> :
						<div styleName="empty">
							<i />
							<p>没有优惠券哦~</p>
						</div>
					}

				</Layout.Body>
			</Layout>
		)
	}
}

export default ViewCoupon