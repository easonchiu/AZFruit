import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'

import Layout from 'src/auto/layout'
import Cell from 'src/auto/cell'
import Button from 'src/auto/button'
import AppFooter from 'src/components/appFooter'
import NavSpct from 'src/components/navSpct'

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

	render() {
		return (
			<Layout styleName="view-profile">
				
				<Layout.Header
					title="我的"
					addonAfter={<NavSpct />}
				/>

				<Layout.Body>
				
					<Cell styleName="list">
						<Cell.Row arrow onClick={this.addressClick}>
							<label>我的收货地址</label>
						</Cell.Row>
						<Cell.Row arrow onClick={this.couponClick}>
							<label>我的优惠券</label>
						</Cell.Row>
					</Cell>

					<Button type="danger">退出帐号</Button>

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewProfile