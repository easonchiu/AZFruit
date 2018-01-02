import './style'
import React, { Component } from 'react'
import Layout from 'src/auto/layout'
import { Link } from 'react-router-dom'
import connect from 'src/redux/connect'
import { getToken } from 'src/assets/libs/token'

@connect
class AppFooter extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		if (getToken()) {
			this.timer = setTimeout(e => {
				if (this.props.$$shoppingcart.amount === '') {
					this.props.$shoppingcart.fetchAmount()
				}
				if (this.props.$$order.amount === '') {
					this.props.$order.fetchAmount()
				}
			}, 500)
		}
	}

	shouldComponentUpdate(np, ns) {
		return (this.props.$$shoppingcart.amount !== np.$$shoppingcart.amount) || (this.props.$$order.amount !== np.$$order.amount)
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	render() {
		const pathname = this.props.pathname
		return (
			<Layout.Footer className="app-footer">
				<Link to="/" className={pathname === '/' ? 'active' : ''}>
					<i className="icon-home" />
					<p>首页</p>
				</Link>
				<Link to="/category" className={pathname.indexOf('/category') === 0 ? 'active' : ''}>
					<i className="icon-category" />
					<p>全部</p>
				</Link>
				<Link to="/shoppingcart" className={pathname.indexOf('/shoppingcart') === 0 ? 'active' : ''}>
					{
						this.props.$$shoppingcart.amount !== '' &&
						this.props.$$shoppingcart.amount > 0 ?
						<sub>{this.props.$$shoppingcart.amount}</sub> :
						null
					}
					<i className="icon-shoppingcart" />
					<p>购物车</p>
				</Link>
				<Link to="/profile" className={pathname === '/profile' ? 'active' : ''}>
					{
						this.props.$$order.amount !== '' &&
						this.props.$$order.amount > 0 ?
						<sub>{this.props.$$order.amount}</sub> :
						null
					}
					<i className="icon-profile" />
					<p>我的</p>
				</Link>
			</Layout.Footer>
		)
	}
}

export default AppFooter