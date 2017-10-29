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
		if (this.props.$$shoppingcart.count === '') {
			this.props.$shoppingcart.count()
		}
	}

	render() {
		return (
			<Link className="nav-top-spct" to="/shoppingcart">
				{
					this.props.$$shoppingcart.count !== '' &&
					this.props.$$shoppingcart.count > 0 ?
					<span>{this.props.$$shoppingcart.count}</span> :
					null
				}
			</Link>
		)
	}
}

export default NavSpct