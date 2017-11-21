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
		})
	}

	componentDidMount() {
		const id = this.props.match.params.id
		this.fetch(id)
	}

	async fetch(id) {
		this.data.loading = true
		try {
			await this.props.$order.fetchDetail(id)
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	backClick = e => {
		this.props.history.goBack()
	}

	render() {
		const data = this.props.$$order.detail

		return (
			<Layout styleName="view-order-detail">
				
				<Layout.Header
					title="我的订单"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.backClick}
						/>
					}
				/>

				<Layout.Body
					loading={this.data.loading}
					errorInfo={this.data.errorInfo}>
					
					{
						JSON.stringify(data)
					}

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewOrder