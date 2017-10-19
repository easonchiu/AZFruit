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
			name: 'Banner管理',
			badge: 'OK'
		}, {
			link: '/category/list',
			match: '/category',
			name: '分类管理',
			badge: 'OK'
		}, {
			link: '/product/list',
			match: '/product',
			name: '产品管理',
			badge: '差图片与详情文案'
		}, {
			link: '/quick/list',
			match: '/quick',
			name: '首页快捷入口管理',
			badge: 'OK'
		}, {
			link: '/order/list',
			match: '/order',
			name: '订单管理'
		}, {
			link: '/comment/list',
			match: '/comment',
			name: '评价管理'
		}, {
			link: '/user/list',
			match: '/user',
			name: '用户管理'
		}, {
			link: '/coupon/list',
			match: '/coupon',
			name: '优惠券管理'
		}, {
			link: '/postage/list',
			match: '/postage',
			name: '运费规则管理',
			badge: 'OK'
		}, {
			link: '/discount/list',
			match: '/discount',
			name: '满减规则管理'
		}]

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