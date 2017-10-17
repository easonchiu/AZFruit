import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import ReactSwipe from 'react-swipe'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'

@connect
@reactStateData
class ViewIndex extends Component {
	constructor(props) {
		super(props)

		this.setData({
			bannerIndex: 0
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	// 滚动banner滑动结束事件
	bannerScrollEnd = e => {
		this.data.bannerIndex = e
	}
	
	// 顶部
	renderTop() {
		return (
			<div className="top">

				<div className="top_header">
					<h1>爱泽阳光</h1>
				</div>

				<div className="top_banners">
					<div className="banners">
						<ReactSwipe className="inner" swipeOptions={{
							transitionEnd: this.bannerScrollEnd
						}}>
							<div className="item" style={{backgroundImage:`url(${require('../../assets/3.jpg')})`}}>
								<h1>新鲜到家 闪速送达</h1>
								<p>即日起至活动结束期间全场8折</p>
							</div>
							<div className="item" style={{backgroundImage:`url(${require('../../assets/4.jpg')})`}} />
							<div className="item" style={{backgroundImage:`url(${require('../../assets/4.jpg')})`}} />
						</ReactSwipe>
					</div>
					<div className="dots">
					{
						[0,1,2].map((e, index) => (
							<span key={index} className={index == this.data.bannerIndex ? 'active' : ''} />
						))
					}
					</div>
				</div>

				<div className="top_quick">
					<div className="row">
						<a href="javascript:;" className="item">
							<i></i>
							<p>新鲜到家</p>
						</a>
						<a href="javascript:;" className="item">
							<i></i>
							<p>当季热品</p>
						</a>
						<a href="javascript:;" className="item">
							<i></i>
							<p>超值午餐</p>
						</a>
						<a href="javascript:;" className="item">
							<i></i>
							<p>新品推荐</p>
						</a>
						<a href="javascript:;" className="item">
							<i></i>
							<p>新店特惠</p>
						</a>
					</div>
				</div>
				
				<hr className="body-line" />
			</div>
		)
	}

	render() {
		return (
			<Layout className="view-index">
				<Layout.Body>
				
					{this.renderTop()}

				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewIndex