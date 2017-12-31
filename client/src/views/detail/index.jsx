import style from './style'
import React, { PureComponent as Component } from 'react'
import { Link } from 'react-router-dom'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'
import {getToken} from 'src/assets/libs/token'

import CDN from 'src/assets/libs/cdn'
import ReactSwipe from 'react-swipe'
import cn from 'classnames'

import Layout from 'src/auto/layout'
import Button from 'src/auto/button'
import Popup from 'src/auto/popup'
import Toast from 'src/auto/toast'
import Loading from 'src/auto/loading'

@connect
@mass(style)
@stateData
class ViewDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			imgsIndex: 0,
			activeSku: 0,
			popupVisible: false,
			ghostHeader: true
		})
	}

	componentDidMount() {
		this.fetch(this.props.match.params.id)

		if (getToken()) {
			this.timer = setTimeout(e => {
				if (this.props.$$shoppingcart.amount === '') {
					this.props.$shoppingcart.fetchAmount()
				}
			}, 500)
		}
	}

	async fetch(id) {
		this.data.loading = true
		try {
			await Promise.all([
				await this.props.$goods.fetchDetail(id),
				await this.props.$goods.fetchSku(id)
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
		const token = getToken()
		if (!token) {
			const redirect = encodeURIComponent(window.location.href)
			this.props.history.replace('/login?redirect=' + redirect)
			return
		}
		this.data.popupVisible = true
	}

	renderCover() {
		const data = this.props.$$goods.detail || {}

		return (
			<div styleName="cover" ref={e => this.coverPic = e}>
				<div styleName="cover-imgs">
					<ReactSwipe styleName="imgs" swipeOptions={{
						transitionEnd: this.bannerScrollEnd
					}}>
						{
							data.imgs && data.imgs.map((res, i) => {
								return (
									<div key={i}
										styleName="item"
										style={{backgroundImage:`url(${CDN+res})`}} />
								)
							})
						}
					</ReactSwipe>
				</div>
				{
					data.imgs && data.imgs.length > 1 ?
					<div styleName="dots">
					{
						data.imgs.map((res, i) => (
							<span key={i} styleName={i == this.data.imgsIndex ? 'active' : ''} />
						))
					}
					</div> :
					null
				}
			</div>
		)
	}

	renderBaseInfo() {
		const data = this.props.$$goods.detail || {}

		return (
			<div styleName="info">
				<div styleName="title">
					<h1>
						{data.name}
						{
							data.badge ?
							<span styleName="badge">
								<em style={{backgroundColor:data.badgeColor}}>{data.badge}</em>
							</span> :
							null
						}
					</h1>
					{
						data.origin && data.isImport ?
						<span styleName="import"><i />{data.origin}</span> :
						null
					}
				</div>
				<p>{data.desc}</p>
				<h6 styleName="price">
					<span>￥</span>
					<em>{data.price && data.price / 100}</em>
					<span>元/{data.unit}</span>
					{
						data.prePrice > data.price ?
						<del>原价 {data.prePrice && data.prePrice / 100}元</del> :
						null
					}
				</h6>
			</div>	
		)
	}

	// 监听body滚动，切换头样式
	bodyScroll = e => {
		const t = e.target.scrollTop
		const coverH = this.coverPic.clientHeight

		if (t > coverH - 50 && this.data.ghostHeader) {
			this.data.ghostHeader = false
		} else if (t <= coverH - 50 && !this.data.ghostHeader) {
			this.data.ghostHeader = true
		}
	}
	
	// 规格点击
	skuClick = e => {
		this.data.activeSku = e
	}

	// 确定加入购物车
	addToCartOk = async e => {
		const sku = this.props.$$goods.sku || []
		const data = sku[this.data.activeSku]

		if (data) {
			this.data.popupVisible = false
			Loading.show()
			try {
				const pid = this.props.match.params.id
				const skuId = data.id
				
				await this.props.$shoppingcart.create({
					pid,
					skuId,
					amount: 1
				})

				await this.props.$shoppingcart.fetchAmount()
				
				Toast.show('在购物中等你哟')
			} catch(e) {
				Toast.show(e.msg)
			}
			Loading.hide()
		} else {
			Toast.show('系统错误')
		}
	}
	
	// 购物车弹层
	renderAddtoCartPopup() {
		const data = this.props.$$goods.detail || {}
		const sku = this.props.$$goods.sku || []
		
		if (!sku.length) {
			return null
		}

		return (
			<Popup
				styleName="add-to-cart-popup"
				visible={this.data.popupVisible}
				onBgClick={e => this.data.popupVisible = false}>
				<div styleName="thumb">
					<img src={CDN + data.cover} />
				</div>
				<div styleName="base-info">
					<h1>
						{data.name}
						{
							data.badge ?
							<span styleName="badge">
								<em style={{backgroundColor:data.badgeColor}}>{data.badge}</em>
							</span> :
							null
						}
					</h1>
					<p>{data.desc}</p>
				</div>
				<div styleName="list">
				{
					sku && sku.map((res, i) => {
						const css = cn('list-item', {
							active: this.data.activeSku == i
						})
						return (
							<a href="javascript:;"
								styleName={css} key={res.id}
								onClick={this.skuClick.bind(this,i)}>
								<label>{res.desc}</label>
								<p>{res.price / 100}元/{res.unit}</p>
								{
									res.prePrice > res.price ?
									<span>
										原价{res.prePrice / 100}元
									</span> :
									null
								}
							</a>
						)
					})
				}
				</div>
				<hr className="body-line" />
				<div styleName="buttons">
					<Button type="default" onClick={e => this.data.popupVisible = false}>取消</Button>
					<Button onClick={this.addToCartOk}>确定</Button>
				</div>
			</Popup>
		)
	}

	render() {
		const data = this.props.$$goods.detail || {}
		const sku = this.props.$$goods.sku || []

		return (
			<Layout styleName="view-detail">
				<Layout.Header
					ghost={this.data.ghostHeader}
					title={data.name}
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.backClick}
						/>
					}
					addonAfter={
						<Link to="/shoppingcart" styleName="shoppingcart">
							{
								this.props.$$shoppingcart.amount !== '' &&
								this.props.$$shoppingcart.amount > 0 ?
								<sub>{this.props.$$shoppingcart.amount}</sub> :
								null
							}
						</Link>
					}
				/>

				<Layout.Body
					styleName="body"
					errorInfo={this.data.errorInfo}
					onScroll={this.bodyScroll}
					loading={this.data.loading}
				>

					{this.renderCover()}

					{this.renderBaseInfo()}

					<hr className="body-line" />

					<div styleName="detail">
						<ul styleName="parameter">
							{
								data.parameter && data.parameter.map((res, i) => (
									<li key={i}>
										<label>{res.name}</label>
										<p>{res.value}</p>
									</li>
								))
							}
						</ul>
						<div styleName="more" dangerouslySetInnerHTML={{__html: data.detail}} />
					</div>

				</Layout.Body>

				<Layout.Footer
					styleName="footer"
					visible={!this.data.loading && this.data.errorInfo === ''}
				>
					{
						sku.length ?
						<Button onClick={this.addToCart}>加入购物车</Button> :
						<Button type="gray">库存不足</Button>
					}
				</Layout.Footer>
				
				{this.renderAddtoCartPopup()}

			</Layout>
		)
	}
}

export default ViewDetail