import './style'
import React, { PureComponent } from 'react'
import Layout from 'src/auto/layout'
import { Link } from 'react-router-dom'
import connect from 'src/redux/connect'
import { getToken } from 'src/assets/libs/token'

@connect
class AppFooter extends PureComponent {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		if (this.props.$$shoppingcart.amount === '' && getToken()) {
			this.timer = setTimeout(e => {
				this.props.$shoppingcart.fetchAmount()
				this.props.$order.fetchAmount()
			}, 500)
		}
	}

	componentWillUnmount() {
		clearTimeout(this.timer)
	}

	render() {
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
				<Link to="/shoppingcart">
					{
						this.props.$$shoppingcart.amount !== '' &&
						this.props.$$shoppingcart.amount > 0 ?
						<sub>{this.props.$$shoppingcart.amount}</sub> :
						null
					}
					<i className="icon-shoppingcart" />
					<p>购物车</p>
				</Link>
				<Link to="/profile">
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