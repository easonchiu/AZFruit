import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'

@connect
@mass(style)
class ViewLogin extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<Layout styleName="view-login">
				<Layout.Header title="登录" />

				<Layout.Body>
				
					body

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewLogin