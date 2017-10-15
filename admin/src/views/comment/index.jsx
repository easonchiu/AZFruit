import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'


@connect
@reactStateData
class ViewComment extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	render() {
		return (
			<div className="view-comment">
				<h1>评价管理 / 一期暂不开发</h1>
			</div>
		)
	}
}

export default ViewComment