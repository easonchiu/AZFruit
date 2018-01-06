import React from 'react'
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom'

import {getToken, clearToken} from 'src/assets/libs/token'

import ViewIndex from 'src/views/index'
import ViewCategory from 'src/views/category'
import ViewDetail from 'src/views/detail'
import ViewLogin from 'src/views/login'
import ViewPlaceOrder from 'src/views/placeOrder'
import ViewOrder from 'src/views/order'
import ViewOrderDetail from 'src/views/orderDetail'
import ViewProfile from 'src/views/profile'
import ViewShoppingcart from 'src/views/shoppingcart'
import ViewAddress from 'src/views/address'
import ViewAddressChoose from 'src/views/addressChoose'
import ViewAddressDetail from 'src/views/addressDetail'
import ViewCoupon from 'src/views/coupon'

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
		const redirect = encodeURIComponent(window.location.href)
		return <Redirect to={`/login?redirect=${redirect}`} />
	}
}

const Routes = () => {
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/" component={ ViewIndex }/>
				<Route exact path="/category/:id?" component={ ViewCategory }/>
				<Route exact path="/detail/:id" component={ ViewDetail }/>
				<Route exact path="/login" component={ ViewLogin }/>
				<Route exact path="/placeOrder/:aid?" component={ LoginIfNeeded(ViewPlaceOrder)(true) }/>
				<Route exact path="/order/detail" component={ LoginIfNeeded(ViewOrderDetail)(true) }/>
				<Route exact path="/order/:type?" component={ LoginIfNeeded(ViewOrder)(true) }/>
				<Route exact path="/profile" component={ LoginIfNeeded(ViewProfile)(true) }/>
				<Route exact path="/shoppingcart" component={ LoginIfNeeded(ViewShoppingcart)(true) }/>
				<Route exact path="/address" component={ LoginIfNeeded(ViewAddress)(true) }/>
				<Route exact path="/address/choose/:id?" component={ LoginIfNeeded(ViewAddressChoose)(true) }/>
				<Route exact path="/address/edit/:id" component={ LoginIfNeeded(ViewAddressDetail)(true) }/>
				<Route exact path="/address/create/:first?" component={ LoginIfNeeded(ViewAddressDetail)(true) }/>
				<Route exact path="/coupon/:id?" component={ LoginIfNeeded(ViewCoupon)(true) } />
				<Redirect from="*" to="/" />
			</Switch>
		</BrowserRouter>
	)
}

export default Routes