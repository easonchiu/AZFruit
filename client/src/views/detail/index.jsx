import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import CDN from 'src/assets/libs/cdn'
import ReactSwipe from 'react-swipe'
import cn from 'classnames'
import NavSpct from 'src/components/navSpct'

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
			activeSpec: 0,
			popupVisible: false
		})
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

	renderCover() {
		const data = this.props.$$goods.detail || {}

		return (
			<div styleName="cover">
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
						<del>市场价 {data.prePrice && data.prePrice / 100}元</del> :
						null
					}
				</h6>
			</div>	
		)
	}
	
	// 规格点击
	specClick = e => {
		this.data.activeSpec = e
	}

	// 确定加入购物车
	addToCartOk = async e => {
		const spec = this.props.$$goods.spec || []
		const data = spec[this.data.activeSpec]

		if (data) {
			Loading.show()
			try {
				const pid = this.props.match.params.id
				const specId = data.id
				
				await this.props.$shoppingcart.create({
					pid,
					specId,
					amount: 1,
					uid: 'test'
				})
				await this.props.$shoppingcart.fetchAmount()
				this.data.popupVisible = false
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
		const spec = this.props.$$goods.spec || []

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
					spec && spec.map((res, i) => {
						const css = cn('list-item', {
							active: this.data.activeSpec == i
						})
						return (
							<a href="javascript:;"
								styleName={css} key={res.id}
								onClick={this.specClick.bind(this,i)}>
								<label>{res.desc}</label>
								<p>{res.price / 100}元/{res.unit}</p>
								{
									res.prePrice > res.price ?
									<span>
										市场价{res.prePrice / 100}元
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

		return (
			<Layout styleName="view-detail">
				<Layout.Header
					ghost
					title={data.name}
					addonBefore={
						<a href="javascript:;"
							className="back"
							onClick={this.backClick}
						/>
					}
					addonAfter={<NavSpct />}
				/>

				<Layout.Body
					styleName="body"
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>

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
						<div>
							{data.detail}
						</div>
					</div>

				</Layout.Body>

				<Layout.Footer styleName="footer">
					<Button onClick={this.addToCart}>加入购物车</Button>
				</Layout.Footer>
				
				{this.renderAddtoCartPopup()}

			</Layout>
		)
	}
}

export default ViewDetail