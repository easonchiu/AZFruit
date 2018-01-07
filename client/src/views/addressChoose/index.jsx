import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import { Link } from 'react-router-dom'
import stateData from 'react-state-data'
import mass from 'mass'
import qs from 'qs'

import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Cell from 'src/auto/cell'

@connect
@mass(style)
@stateData
class ViewAddressChoose extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: true,
			errorInfo: ''
		})

		this.search = qs.parse(props.location.search.replace(/^\?/, ''))
	}

	backClick = e => {
		this.props.history.goBack()
	}

	componentDidMount() {
		this.fetch()
	}

	onClick = e => {
		const coupon = this.search.coupon ? '?coupon=' + this.search.coupon : ''
		this.props.history.push('/placeOrder/' + e.id + coupon)
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$address.fetchList()
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	render() {
		const data = this.props.$$address.list
		const defAddress = this.props.$$address.default
		const aid = this.props.match.params.id

		return (
			<Layout styleName="view-address-choose">
				
				<Layout.Header
					title="选择地址"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.backClick} />
					}
					addonAfter={
						<Link to="/address"
							styleName="manage">
							地址管理
						</Link>
					} />

				<Layout.Body
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
					
					{
						data.length ?
						<Cell>
							{
								data.map(res => (
									<Cell.Row href="javascript:;"
										key={res.id}
										onClick={this.onClick.bind(this, res)}
										styleName="item">
										{
											aid == res.id ||
											(aid == undefined && res.id == defAddress) ?
											<sup /> :
											<sub />
										}
										<div styleName="text">
											<h6>
												{
													res.id === defAddress ?
													<strong>默认</strong> :
													null
												}
												{res.name}
												<span>{res.mobile}</span>
											</h6>
											<p>{res.area} {res.address}</p>
										</div>
									</Cell.Row>
								))
							}
						</Cell> :
						<div styleName="empty">
							<i />
							<p>还没有创建过地址哦~</p>
						</div>
					}

				</Layout.Body>

			</Layout>
		)
	}
}

export default ViewAddressChoose