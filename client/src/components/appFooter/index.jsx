import './style'
import React from 'react'
import Layout from 'src/auto/layout'
import { Link } from 'react-router-dom'

const AppFooter = props => {
	return (
		<Layout.Footer className="app-footer">
			<Link to="/">首页</Link>
			<Link to="/category">全部</Link>
			<Link to="/order">订单</Link>
			<Link to="/profile">我的</Link>
		</Layout.Footer>
	)
}

export default AppFooter