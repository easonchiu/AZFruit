import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'

@connect
@reactStateData
class ViewOrder extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	render() {
		return (
			<Layout className="view-order">
				<Layout.Header title="订单" />

				<Layout.Body>
				
					body

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewOrder