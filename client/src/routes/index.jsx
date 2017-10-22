import React from 'react'
import { HashRouter as Router, Route, Redirect, Switch } from 'react-router-dom'

import ViewIndex from 'src/views/index'
import ViewCategory from 'src/views/category'
import ViewDetail from 'src/views/detail'
import ViewLogin from 'src/views/login'
import ViewOrder from 'src/views/order'
import ViewProfile from 'src/views/profile'

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
				<Redirect from="*" to="/" />
			</Switch>
		</Router>
	)
}

export default Routes