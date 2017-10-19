import './style'
import React from 'react'
import { Route } from 'react-router-dom'

// banner管理
import ViewBanner from 'src/views/banner'
import ViewBannerDetail from 'src/views/bannerDetail'

// 产品管理
import ViewProduct from 'src/views/product'
import ViewProductDetail from 'src/views/productDetail'

// 产品规格管理
import ViewProductSpec from 'src/views/productSpec'
import ViewProductSpecDetail from 'src/views/productSpecDetail'

// 快捷入口管理
import ViewQuick from 'src/views/quick'
import ViewQuickDetail from 'src/views/quickDetail'

// 订单管理
import ViewOrder from 'src/views/order'

// 评价管理
import ViewComment from 'src/views/comment'

// 分类管理
import ViewCategory from 'src/views/category'
import ViewCategoryDetail from 'src/views/categoryDetail'

// 用户管理
import ViewUser from 'src/views/user'

// 运费管理
import ViewPostage from 'src/views/postage'
import ViewPostageDetail from 'src/views/postageDetail'

const Main = ({children}) => {
	return (
		<div className="app-main">
			<div className="main-inner">
				<Route exact path="/banner/list" component={ ViewBanner } />
				<Route exact path="/banner/detail/:id?" component={ ViewBannerDetail } />

				<Route exact path="/category/list" component={ ViewCategory } />
				<Route exact path="/category/detail/:id?" component={ ViewCategoryDetail } />

				<Route exact path="/product/list" component={ ViewProduct } />
				<Route exact path="/product/detail/:id?" component={ ViewProductDetail } />

				<Route exact path="/product/:pid/spec/list" component={ ViewProductSpec } />
				<Route exact path="/product/:pid/spec/detail/:sid?" component={ ViewProductSpecDetail } />

				<Route exact path="/quick/list" component={ ViewQuick } />
				<Route exact path="/quick/detail/:id?" component={ ViewQuickDetail } />

				<Route exact path="/postage/list" component={ ViewPostage } />
				<Route exact path="/postage/detail/:id?" component={ ViewPostageDetail } />

				<Route exact path="/order/list" component={ ViewOrder } />

				<Route exact path="/comment/list" component={ ViewComment } />
				


				<Route exact path="/user/list" component={ ViewUser } />
			</div>
		</div>
	)
}

export default Main