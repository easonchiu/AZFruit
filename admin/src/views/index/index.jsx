import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import { Route } from 'react-router-dom'

import Header from 'src/containers/header'
import Aside from 'src/containers/aside'
import Main from 'src/containers/main'

@connect
@reactStateData
class ViewIndex extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	render() {
		return (
			<div className="view-index">
				<Aside />
				<Header />
				<Route component={Main} />
			</div>
		)
	}
}

export default ViewIndex