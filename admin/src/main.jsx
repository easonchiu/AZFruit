import 'src/assets/css/reset'
import 'element-theme-default'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

// store
import configureStore from 'src/redux/store'
const store = configureStore()

import ViewIndex from 'src/views/index'
import ViewLogin from 'src/views/login'

// render to #root
render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route path="/login"  component={ ViewLogin } />
				<Route component={ ViewIndex } />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
)
