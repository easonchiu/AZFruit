import 'src/assets/css/reset'
import 'element-theme-default'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import { getToken, clearToken } from 'src/assets/libs/token'

const Router = process.env.ENV_NAME !== 'develop' ? BrowserRouter : HashRouter
const basename = process.env.ENV_NAME !== 'develop' ? '/admin' : ''


// store
import configureStore from 'src/redux/store'
const store = configureStore()

import ViewIndex from 'src/views/index'
import ViewLogin from 'src/views/login'

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


// render to #root
render(
	<Provider store={store}>
		<Router basename={basename}>
			<Switch>
				<Route path="/login" component={ LoginIfNeeded(ViewLogin)(false) } />
				<Route component={ LoginIfNeeded(ViewIndex)(true) } />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
)
