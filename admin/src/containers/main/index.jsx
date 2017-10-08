import './style'
import React from 'react'
import { Route } from 'react-router-dom'

import ViewBanner from 'src/views/banner'
import ViewBannerDetail from 'src/views/bannerDetail'

const Main = ({children}) => {
	return (
		<div className="app-main">
			<div className="main-inner">
				<Route exact path="/banner/list" component={ ViewBanner } />
				<Route exact path="/banner/detail/:id" component={ ViewBannerDetail } />
			</div>
		</div>
	)
}

export default Main