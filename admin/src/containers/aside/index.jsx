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
			name: '首页banner管理',
			badge: 'ok'
		}, {
			link: '/quick/list',
			match: '/quick',
			name: '首页快捷入口管理',
			badge: 'ok'
		}, {
			link: '/recom/list',
			match: '/recom',
			name: '首页推荐管理',
			badge: 'ok'
		}, {
			link: '/ranking/list',
			match: '/ranking',
			name: '首页排行榜管理',
			badge: 'ok'
		}, {
			link: '/category/list',
			match: '/category',
			name: '分类管理',
			badge: 'ok'
		}, {
			link: '/goods/list',
			match: '/goods',
			name: '产品管理',
			badge: 'ok'
		}, {
			link: '/order/list',
			match: '/order',
			name: '订单管理'
		},
		// {
		// 	link: '/comment/list',
		// 	match: '/comment',
		// 	name: '评价管理',
		// 	badge: 'delay'
		// },
		{
			link: '/user/list',
			match: '/user',
			name: '用户管理',
			badge: 'ok'
		}, {
			link: '/coupon/list',
			match: '/coupon',
			name: '优惠券管理',
			badge: 'ok'
		}, {
			link: '/postage/list',
			match: '/postage',
			name: '运费规则管理',
			badge: 'ok'
		},
		// {
		// 	link: '/discount/list',
		// 	match: '/discount',
		// 	name: '满减规则管理',
		// 	badge: 'delay'
		// }
		]

		const current = this.props.location.pathname

		return (
			<div className="app-aside">
				<ul>
				{
					menu.map(res => (
						<li key={res.link} className={current.indexOf(res.match) >= 0 ? 'active' : ''}>
							<a onClick={e => this.click(res.link)} href="javascript:;">{res.name}</a>
							{
								res.badge ?
								<Badge className="mark" value={res.badge} /> :
								null
							}
						</li>
					))
				}
				</ul>
			</div>
		)
	}
}

export default Aside