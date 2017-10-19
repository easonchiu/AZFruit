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

		this.setData({
			loading: false,
			errorInfo: '',
			active: 3
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$category.fetchList()
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	categoryClick = res => {
		this.data.active = res.i
	}

	render() {
		const categoryList = this.props.$$category.list

		return (
			<Layout className="view-category">
				<Layout.Header title="全部" />

				<Layout.Body
					className="body"
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
					<nav className="category">
						{
							categoryList.map((res, i) => (
								<a href="javascript:;" key={res.id}
									onClick={this.categoryClick.bind(this, {...res,i})}
									className={i == this.data.active ? 'active' : ''}>
									<p>{res.name}</p>
									{
										res.badge ?
										<span style={{backgroundColor:res.badgeColor}}>
											{res.badge}
										</span> :
										null
									}
								</a>
							))
						}
					</nav>
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