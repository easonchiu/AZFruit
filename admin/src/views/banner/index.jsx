import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Link } from 'react-router-dom'


@connect
@reactStateData
class ViewBanner extends Component {
	constructor(props) {
		super(props)
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		try {
			await this.props.$banner.fetchList()
		} catch(e) {
			console.error(e)
		}
	}

	render() {
		return (
			<div className="view-banner">
			{
				this.props.$$banner.list.map(res => {
					return (
						<div className="item" key={res.id}>
							uri:{res.uri}
							&nbsp;|&nbsp;
							index:{res.index}
							&nbsp;|&nbsp;
							online:{res.online == true ? 'true' : 'false'}
							&nbsp;|&nbsp;
							<Link to={`/banner/detail/${res.id}`}>{res.id}</Link>
						</div>
					)
				})
			}
			</div>
		)
	}
}

export default ViewBanner