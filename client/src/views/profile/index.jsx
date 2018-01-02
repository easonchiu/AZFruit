import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import { clearToken } from 'src/assets/libs/token'

import Layout from 'src/auto/layout'
import Cell from 'src/auto/cell'
import AppFooter from 'src/components/appFooter'
import Alert from 'src/auto/alert'

@connect
@mass(style)
@stateData
class ViewProfile extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
		})
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$user.fetchBaseInfo()
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
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

	logout = e => {
		Alert.show({
			title: '退出登录',
			desc: '确定要退出帐号吗？',
			btnTextN: '取消',
			btnTextY: '退出登录',
			callbackY: e => {
				clearToken()
				this.props.history.replace('/')
			}
		})
	}

	render() {
		const data = this.props.$$user.data || {}
		const mobile = data.mobile ? data.mobile.substr(0,3) + '****' + data.mobile.substr(-4) : ''

		return (
			<Layout styleName="view-profile">
				
				<Layout.Header
					styleName="header"
					addonAfter={
						<a href="javascript:;"
							onClick={this.logout}
						>
							退出帐号
						</a>
					}
				>
					<i />
					{
						mobile ?
						<p>{mobile}</p> :
						<p>{mobile}</p>
					}
				</Layout.Header>

				<Layout.Body>

					<Cell styleName="list">
						<Cell.Row arrow onClick={this.orderClick}>
							<label>我的订单</label>
							{
								this.props.$$order.amount !== '' &&
								this.props.$$order.amount > 0 ?
								<sub>{this.props.$$order.amount}个新订单</sub> :
								null
							}
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

				<AppFooter pathname={this.props.location.pathname} />
			</Layout>
		)
	}
}

export default ViewProfile