import 'src/assets/css/reset'

import React, { Component } from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

// store
import configureStore from 'src/redux/store'
const store = configureStore()

// index
import ViewIndex from 'src/views/index'

// render to #root
render(
	<Provider store={store}>
		<Router>
			<Switch>
				<Route component={ ViewIndex } />
			</Switch>
		</Router>
	</Provider>,
	document.getElementById('root')
)
