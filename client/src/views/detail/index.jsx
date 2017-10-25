import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import CDN from 'src/assets/libs/cdn'
import ReactSwipe from 'react-swipe'

import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Popup from 'src/auto/popup'


@connect
@reactStateData
class ViewDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			imgsIndex: 0,
			popupVisible: false
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		this.fetch(this.props.match.params.id)
	}

	async fetch(id) {
		this.data.loading = true
		try {
			await Promise.all([
				await this.props.$goods.fetchDetail(id),
				await this.props.$goods.fetchSpec(id)
			])
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	bannerScrollEnd = e => {
		this.data.imgsIndex = e
	}

	backClick = e => {
		this.props.history.goBack()
	}

	addToCart = e => {
		this.data.popupVisible = true
	}

	render() {
		const data = this.props.$$goods.detail || {}
		const spec = this.props.$$goods.spec || []

		return (
			<Layout className="view-detail">
				<Layout.Header
					ghost
					title={data.name}
					addonBefore={<a href="javascript:;" className="back" onClick={this.backClick} />} />

				<Layout.Body
					className="body"
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>

					<div className="cover">
						<div className="cover-imgs">
							<ReactSwipe className="imgs" swipeOptions={{
								transitionEnd: this.bannerScrollEnd
							}}>
								{
									data.imgs && data.imgs.map((res, i) => {
										return (
											<div key={i}
												className="item"
												style={{backgroundImage:`url(${CDN+res})`}} />
										)
									})
								}
							</ReactSwipe>
						</div>
						{
							data.imgs && data.imgs.length > 1 ?
							<div className="dots">
							{
								data.imgs.map((res, i) => (
									<span key={i} className={i == this.data.imgsIndex ? 'active' : ''} />
								))
							}
							</div> :
							null
						}
					</div>

					<div className="info">
						<div className="title">
							<h1>
								{data.name}
								{
									data.badge ?
									<span className="badge">
										<em style={{backgroundColor:data.badgeColor}}>{data.badge}</em>
									</span> :
									null
								}
							</h1>
							{
								data.origin && data.isImport ?
								<span className="import"><i />{data.origin}</span> :
								null
							}
						</div>
						<p>{data.desc}</p>
						<h6 className="price">
							<span>￥</span>
							<em>{data.price}</em>
							<span>元/{data.unit}</span>
							{
								data.prePrice > data.price ?
								<del>市场价 {data.prePrice}元</del> :
								null
							}
						</h6>
					</div>

					<hr className="body-line" />

					<div className="detail">
						<ul className="parameter">
							{
								data.parameter && data.parameter.map((res, i) => (
									<li key={i}>
										<label>{res.name}</label>
										<p>{res.value}</p>
									</li>
								))
							}
						</ul>
						<div>
							{data.detail}
						</div>
					</div>

				</Layout.Body>

				<Layout.Footer className="footer">
					<Button onClick={this.addToCart}>加入购物车</Button>
				</Layout.Footer>
				
				<Popup
					className="add-to-cart-popup"
					visible={this.data.popupVisible}
					onBgClick={e => this.data.popupVisible = false}>
					{
						data.cover ?
						<div className="thumb">
							<img src={CDN + data.cover} />
						</div> :
						null
					}
					{
						spec && spec.map((res, i) => {
							return (
								<div key={i}>
									{res.desc}/
									{res.price}元/{res.unit}
									原价{res.prePrice}
								</div>
							)
						})
					}
					<div className="buttons">
						<Button>加入购物车</Button>
					</div>
				</Popup>

			</Layout>
		)
	}
}

export default ViewDetail