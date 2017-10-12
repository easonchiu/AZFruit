import './style'
import React from 'react'
import { Route } from 'react-router-dom'

import ViewBanner from 'src/views/banner'
import ViewBannerDetail from 'src/views/bannerDetail'

import ViewProduct from 'src/views/product'
import ViewProductDetail from 'src/views/productDetail'

import ViewQuick from 'src/views/quick'
import ViewQuickDetail from 'src/views/quickDetail'

import ViewOrder from 'src/views/order'

import ViewComment from 'src/views/comment'

import ViewClass from 'src/views/class'
import ViewClassDetail from 'src/views/classDetail'

import ViewUser from 'src/views/user'

const Main = ({children}) => {
	return (
		<div className="app-main">
			<div className="main-inner">
				<Route exact path="/banner/list" component={ ViewBanner } />
				<Route exact path="/banner/detail/:id?" component={ ViewBannerDetail } />

				<Route exact path="/class/list" component={ ViewClass } />
				<Route exact path="/class/detail/:id?" component={ ViewClassDetail } />

				<Route exact path="/product/list" component={ ViewProduct } />
				<Route exact path="/product/detail/:id?" component={ ViewProductDetail } />

				<Route exact path="/quick/list" component={ ViewQuick } />
				<Route exact path="/quick/detail/:id?" component={ ViewQuickDetail } />

				<Route exact path="/order/list" component={ ViewOrder } />

				<Route exact path="/comment/list" component={ ViewComment } />
				


				<Route exact path="/user/list" component={ ViewUser } />
			</div>
		</div>
	)
}

export default Main