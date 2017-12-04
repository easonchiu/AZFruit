import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import { Link } from 'react-router-dom'
import stateData from 'react-state-data'
import mass from 'mass'

import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Cell from 'src/auto/cell'

@connect
@mass(style)
@stateData
class ViewAddress extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: true,
			errorInfo: ''
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
			await this.props.$address.fetchList()
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	createAddress = e => {
		const data = this.props.$$address.list
		
		if (data.length) {
			this.props.history.push('/address/create')
		} else {
			this.props.history.push('/address/create/first')
		}
	}

	render() {
		const data = this.props.$$address.list
		const defAddress = this.props.$$address.default

		return (
			<Layout styleName="view-address">
				
				<Layout.Header
					title="地址管理"
					addonBefore={<a href="javascript:;" className="back" onClick={this.backClick} />} />

				<Layout.Body
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
					
					{
						data.length ?
						<Cell>
							{
								data.map(res => (
									<Cell.Row key={res.id} styleName="item">
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
										<Link to={`/address/edit/${res.id}`} />
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
				
				<Layout.Footer styleName="footer">
					<Button onClick={this.createAddress}>添加新地址</Button>
				</Layout.Footer>
			</Layout>
		)
	}
}

export default ViewAddress