import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import ReactSwipe from 'react-swipe'
import CDN from 'src/assets/libs/cdn'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'
import GoodsItem from 'src/components/goodsItem'
import TopGoodsItem from 'src/components/topGoodsItem'

@connect
@reactStateData
class ViewIndex extends Component {
	constructor(props) {
		super(props)

		this.setData({
			bannerIndex: 0,
			loading: false,
			errorInfo: '',
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await Promise.all([
				this.props.$quick.fetchList(),
				this.props.$banner.fetchList(),
				this.props.$goods.fetchRecommendList(),
			])
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	// 滚动banner滑动结束事件
	bannerScrollEnd = e => {
		this.data.bannerIndex = e
	}
	
	// 顶部
	renderTop() {
		const quickList = this.props.$$quick.list
		const bannerList = this.props.$$banner.list

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
							{
								bannerList.map((res, i) => {
									return (
										<div key={i}
											className="item"
											style={{backgroundImage:`url(${CDN+res.uri})`}} />
									)
								})
							}
						</ReactSwipe>
					</div>
					{
						bannerList.length > 1 ?
						<div className="dots">
						{
							bannerList.map((res, i) => (
								<span key={i} className={i == this.data.bannerIndex ? 'active' : ''} />
							))
						}
						</div> :
						null
					}
				</div>

				<div className="top_quick">
					<div className="row">
						{
							quickList.map((res, i) => {
								return (
									<a key={i}
										href="javascript:;"
										onClick={e => this.props.history.push(res.link)}
										className="item">
										<i style={{backgroundImage: `url(${CDN+res.uri})`}} />
										<p>{res.name}</p>
									</a>
								)
							})
						}
					</div>
				</div>
				
				<hr className="body-line" />
			</div>
		)
	}

	renderRecommendGoods() {
		const list = this.props.$$goods.recommendList
		
		if (list.length == 0) {
			return null
		}

		const wrapper = []
		for (let i = 0; i < Math.ceil(list.length / 2); i++) {
			wrapper.push(i * 2)
		}

		return (
			<div className="recommend-list">
				<h1><span>当季</span>推荐</h1>
				<div className="goods">
					{
						wrapper.map(res => (
							<div className="row" key={res}>
								{
									list[res] ?
									<GoodsItem source={list[res]} /> :
									null
								}
								{
									list[res + 1] ?
									<GoodsItem source={list[res + 1]} /> :
									null
								}
							</div>
						))
					}
				</div>
				<hr className="body-line" />
			</div>
		)
	}

	renderGuestLoved() {
		return (
			<div className="loved-list">
				<h1><span>吃货</span>最爱</h1>
				<div className="goods">
					{
						[1,2,3,4,5,6,7,8].map(res => (
							<TopGoodsItem key={res} />
						))
					}
				</div>
			</div>
		)
	}

	render() {
		return (
			<Layout className="view-index">
				<Layout.Body
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>
				
					{this.renderTop()}

					{this.renderRecommendGoods()}

					{this.renderGuestLoved()}
					
				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewIndex