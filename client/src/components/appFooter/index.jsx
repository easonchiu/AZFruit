import './style'
import React from 'react'
import Layout from 'src/auto/layout'
import { Link } from 'react-router-dom'

const AppFooter = props => {
	return (
		<Layout.Footer className="app-footer">
			<Link to="/">
				<i className="icon-home" />
				<p>首页</p>
			</Link>
			<Link to="/category">
				<i className="icon-category" />
				<p>全部</p>
			</Link>
			<Link to="/order">
				<i className="icon-order" />
				<p>订单</p>
			</Link>
			<Link to="/profile">
				<i className="icon-profile" />
				<p>我的</p>
			</Link>
		</Layout.Footer>
	)
}

export default AppFooter