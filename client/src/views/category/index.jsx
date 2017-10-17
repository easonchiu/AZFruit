import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'

@connect
@reactStateData
class ViewCategory extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	render() {
		return (
			<Layout className="view-category">
				<Layout.Header title="全部" />

				<Layout.Body className="body">
					<div className="category">
						category
					</div>
					<div className="list">
						list
					</div>
				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewCategory