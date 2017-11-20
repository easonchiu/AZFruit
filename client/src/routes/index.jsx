import React from 'react'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import {getToken, clearToken} from 'src/assets/libs/token'

import ViewIndex from 'src/views/index'
import ViewCategory from 'src/views/category'
import ViewDetail from 'src/views/detail'
import ViewLogin from 'src/views/login'
import ViewOrder from 'src/views/order'
import ViewProfile from 'src/views/profile'
import ViewShoppingcart from 'src/views/shoppingcart'
import ViewAddress from 'src/views/address'
import ViewAddressChoose from 'src/views/addressChoose'
import ViewAddressDetail from 'src/views/addressDetail'

const LoginIfNeeded = View => need => props => {
	const token = getToken()
	if ((token && need) || (!token && !need)) {
		return <View {...props} />
	}
	else {
		clearToken()
		if (props.location.pathname === '/login') {
			return <View {...props} />
		}
		return <Redirect to="/login" />
	}
}

const Routes = () => {
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={ ViewIndex }/>
				<Route exact path="/category" component={ ViewCategory }/>
				<Route exact path="/detail/:id" component={ ViewDetail }/>
				<Route exact path="/login" component={ ViewLogin }/>
				<Route exact path="/order" component={ LoginIfNeeded(ViewOrder)(true) }/>
				<Route exact path="/profile" component={ ViewProfile }/>
				<Route exact path="/shoppingcart/:aid?" component={ LoginIfNeeded(ViewShoppingcart)(true) }/>
				<Route exact path="/address" component={ LoginIfNeeded(ViewAddress)(true) }/>
				<Route exact path="/address/choose/:id?" component={ LoginIfNeeded(ViewAddressChoose)(true) }/>
				<Route exact path="/address/edit/:id" component={ LoginIfNeeded(ViewAddressDetail)(true) }/>
				<Route exact path="/address/create/:first?" component={ LoginIfNeeded(ViewAddressDetail)(true) }/>
				<Redirect from="*" to="/" />
			</Switch>
		</Router>
	)
}

export default Routes