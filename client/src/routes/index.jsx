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
				<Route exact path="/order" component={ ViewOrder }/>
				<Route exact path="/profile" component={ ViewProfile }/>
				<Route exact path="/shoppingcart" component={ LoginIfNeeded(ViewShoppingcart)(true) }/>
				<Redirect from="*" to="/" />
			</Switch>
		</Router>
	)
}

export default Routes