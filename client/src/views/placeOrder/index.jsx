import './style'
import React, { PureComponent as Component } from 'react'
import {Link} from 'react-router-dom'
import connect from 'src/redux/connect'
import stateData from 'react-state-data'

import CDN from 'src/assets/libs/cdn'
import Layout from 'src/auto/layout'
import Panel from 'src/auto/panel'
import Tabs from 'src/auto/tabs'
import Button from 'src/auto/button'

@connect
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
		this.fetch()
	}

	async fetch(type = 1) {
		// this.data.loading = true
		// try {
		// 	await this.props.$order.fetchList({
		// 		type
		// 	})
		// } catch(e) {
		// 	console.error(e)
		// 	this.data.errorInfo = e.msg
		// }
		// this.data.loading = false
	}

	render() {

		return (
			<Layout styleName="view-order">
				
				<Layout.Header
					title="确认订单"
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.props.history.goBack}
						/>
					}
				/>

				<Layout.Body
					loading={this.data.loading}
					errorInfo={this.data.errorInfo}>
					
					place order

				</Layout.Body>

			</Layout>
		)
	}
}

export default ViewOrder