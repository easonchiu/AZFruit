import './style'
import React from 'react'
import { Route, Redirect } from 'react-router-dom'

// banner管理
import ViewBanner from 'src/views/banner'
import ViewBannerDetail from 'src/views/bannerDetail'

// 产品管理
import ViewGoods from 'src/views/goods'
import ViewGoodsDetail from 'src/views/goodsDetail'

// 产品规格管理
import ViewSku from 'src/views/sku'
import ViewSkuDetail from 'src/views/skuDetail'

// 快捷入口管理
import ViewQuick from 'src/views/quick'
import ViewQuickDetail from 'src/views/quickDetail'

// 快捷入口管理
import ViewRanking from 'src/views/ranking'

// 首页推荐管理
import ViewRecom from 'src/views/recom'

// 订单管理
import ViewOrder from 'src/views/order'

// 评价管理
import ViewComment from 'src/views/comment'

// 优惠券管理
import ViewCoupon from 'src/views/coupon'
import ViewCouponDetail from 'src/views/couponDetail'

// 满减规则管理
import ViewDiscount from 'src/views/discount'

// 分类管理
import ViewCategory from 'src/views/category'
import ViewCategoryDetail from 'src/views/categoryDetail'

// 用户管理
import ViewUser from 'src/views/user'
import ViewUserDetail from 'src/views/userDetail'

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

				<Route exact path="/goods/list" component={ ViewGoods } />
				<Route exact path="/goods/detail/:id?" component={ ViewGoodsDetail } />

				<Route exact path="/goods/:pid/sku/list" component={ ViewSku } />
				<Route exact path="/goods/:pid/sku/detail/:sid?" component={ ViewSkuDetail } />

				<Route exact path="/quick/list" component={ ViewQuick } />
				<Route exact path="/quick/detail/:id?" component={ ViewQuickDetail } />

				<Route exact path="/ranking/list" component={ ViewRanking } />

				<Route exact path="/recom/list" component={ ViewRecom } />

				<Route exact path="/postage/list" component={ ViewPostage } />
				<Route exact path="/postage/detail/:id?" component={ ViewPostageDetail } />

				<Route exact path="/order/list" component={ ViewOrder } />

				<Route exact path="/comment/list" component={ ViewComment } />

				<Route exact path="/coupon/list" component={ ViewCoupon } />
				<Route exact path="/coupon/detail/:id?" component={ ViewCouponDetail } />
				
				<Route exact path="/discount/list" component={ ViewDiscount } />
				
				<Route exact path="/user/list" component={ ViewUser } />
				<Route exact path="/user/detail/:id?" component={ ViewUserDetail } />
			</div>
		</div>
	)
}

export default Main