import './style'
import React, { Component } from 'react'

import { Badge } from 'element-react'

class Aside extends Component {
	constructor(props) {
		super(props)
	}

	click(link) {
		this.props.history.push(link)
	}

	render() {
		const menu = [{
			link: '/banner/list',
			match: '/banner',
			name: 'Banner管理'
		}, {
			link: '/product/list',
			match: '/product',
			name: '产品管理'
		}, {
			link: '/order/list',
			match: '/order',
			name: '订单管理'
		}, {
			link: '/comment/list',
			match: '/comment',
			name: '留言管理'
		}, {
			link: '/user/list',
			match: '/user',
			name: '用户管理'
		}]

		const current = this.props.location.pathname

		return (
			<div className="app-aside">
				<ul>
				{
					menu.map(res => (
						<li key={res.link} className={current.indexOf(res.match) >= 0 ? 'active' : ''}>
							<a onClick={e => this.click(res.link)} href="javascript:;">{res.name}</a>
						</li>
					))
				}
				</ul>
			</div>
		)
	}
}

export default Aside