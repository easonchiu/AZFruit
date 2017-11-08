import './style'
import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import mass from 'mass'
import connect from 'src/redux/connect'

@connect
class NavSpct extends PureComponent {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		if (this.props.$$shoppingcart.amount === '') {
			this.props.$shoppingcart.fetchAmount()
		}
	}

	render() {
		return (
			<Link className="nav-top-spct" to="/shoppingcart">
				{
					this.props.$$shoppingcart.amount !== '' &&
					this.props.$$shoppingcart.amount > 0 ?
					<span>{this.props.$$shoppingcart.amount}</span> :
					null
				}
			</Link>
		)
	}
}

export default NavSpct