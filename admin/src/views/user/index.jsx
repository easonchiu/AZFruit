import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'


@connect
@reactStateData
class ViewUser extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	render() {
		return (
			<div className="view-user">
				<h1>user (view)</h1>
			</div>
		)
	}
}

export default ViewUser