import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import Layout from 'src/auto/layout'
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
			imgsIndex: 0,
			activeSpec: 0,
			popupVisible: false
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

	render() {
		return (
			<Layout styleName="view-order">
				
				<Layout.Header
					title="我的订单"
					addonAfter={<NavSpct />} />

				<Layout.Body>
				
					body

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewOrder