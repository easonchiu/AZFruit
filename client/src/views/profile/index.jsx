import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'

import Layout from 'src/auto/layout'
import Cell from 'src/auto/cell'
import AppFooter from 'src/components/appFooter'

@connect
@mass(style)
class ViewProfile extends Component {
	constructor(props) {
		super(props)
	}

	addressClick = e => {
		this.props.history.push('/address')
	}

	couponClick = e => {
		this.props.history.push('/coupon')
	}

	orderClick = e => {
		this.props.history.push('/order')
	}

	render() {
		return (
			<Layout styleName="view-profile">
				
				<Layout.Header
					styleName="header"
					addonAfter={
						<a href="javascript:;">退出帐号</a>
					}
				>
					<i />
					<p>182****8590</p>
				</Layout.Header>

				<Layout.Body>

					

					<Cell styleName="list">
						<Cell.Row arrow onClick={this.orderClick}>
							<label>我的订单</label>
						</Cell.Row>
					</Cell>
				
					<Cell styleName="list">
						<Cell.Row arrow onClick={this.addressClick}>
							<label>我的收货地址</label>
						</Cell.Row>
						<Cell.Row arrow onClick={this.couponClick}>
							<label>我的优惠券</label>
						</Cell.Row>
					</Cell>

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewProfile