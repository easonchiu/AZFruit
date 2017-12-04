import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import ReactSwipe from 'react-swipe'
import CDN from 'src/assets/libs/cdn'

import Layout from 'src/auto/layout'
import AppFooter from 'src/components/appFooter'
import GoodsItem from 'src/components/goodsItem'
import TopGoodsItem from 'src/components/topGoodsItem'
import NavSpct from 'src/components/navSpct'

@connect
@mass(style)
@stateData
class ViewIndex extends Component {
	constructor(props) {
		super(props)

		this.setData({
			bannerIndex: 0,
			loading: false,
			errorInfo: '',
		})
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
				this.props.$goods.fetchRankingList(),
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
			<div styleName="top">

				<div styleName="top_header">
					<h1>爱泽阳光</h1>
					<NavSpct />
				</div>

				<div styleName="top_banners">
					<div styleName="banners">
						<ReactSwipe styleName="inner" swipeOptions={{
							transitionEnd: this.bannerScrollEnd
						}}>
							{
								bannerList.map((res, i) => {
									if (res.link) {
										return (
											<a
												key={i}
												href={res.link}
												styleName="item"
												style={{backgroundImage:`url(${CDN+res.uri})`}}
											/>
										)
									}
									return (
										<div
											key={i}
											styleName="item"
											style={{backgroundImage:`url(${CDN+res.uri})`}}
										/>
									)
								})
							}
						</ReactSwipe>
					</div>
					{
						bannerList.length > 1 ?
						<div styleName="dots">
						{
							bannerList.map((res, i) => (
								<span key={i} styleName={i == this.data.bannerIndex ? 'active' : ''} />
							))
						}
						</div> :
						null
					}
				</div>

				<div styleName="top_quick">
					<div styleName="row">
						{
							quickList.map((res, i) => {
								return (
									<a key={i}
										href={res.link}
										styleName="item">
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
			<div styleName="recommend-list">
				<h1><span>当季</span>推荐</h1>
				<div styleName="goods">
					{
						wrapper.map(res => (
							<div styleName="row" key={res}>
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
		const list = this.props.$$goods.rankingList

		return (
			<div styleName="loved-list">
				<h1><span>吃货</span>最爱</h1>
				<div styleName="goods">
					{
						list.map((res, i) => (
							<TopGoodsItem key={res.id} source={res} top={i} />
						))
					}
				</div>
			</div>
		)
	}

	render() {
		return (
			<Layout styleName="view-index">
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