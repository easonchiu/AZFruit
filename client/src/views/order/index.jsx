import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'
import NavSpct from 'src/components/navSpct'

@connect
@mass(style)
class ViewOrder extends Component {
	constructor(props) {
		super(props)
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