import style from './style'
import React, { PureComponent as Component } from 'react'
import connect from 'src/redux/connect'
import mass from 'mass'
import stateData from 'react-state-data'

import Layout from 'src/auto/layout'
import Toast from 'src/auto/toast'
import Loading from 'src/auto/loading'
import AppFooter from 'src/components/appFooter'
import GoodsItem from 'src/components/goodsItem'
import NavSpct from 'src/components/navSpct'

@connect
@mass(style)
@stateData
class ViewCategory extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			active: 0
		})
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$category.fetchList()
			const first = this.props.$$category.list[0]
			if (first) {
				await this.props.$goods.fetchList(first.id)
			}
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	categoryClick = async res => {
		if (res.i == this.data.active) {
			return false
		}

		this.data.active = res.i
		Loading.show()
		try {
			await this.props.$goods.fetchList(res.id)
		} catch(e) {
			this.props.$goods.clear()
			Toast.show(e.msg)
		}
		Loading.hide()
	}

	renderAside() {
		const categoryList = this.props.$$category.list

		return (
			<nav styleName="category">
				{
					categoryList.map((res, i) => (
						<a href="javascript:;" key={res.id}
							onClick={this.categoryClick.bind(this, {...res,i})}
							styleName={i == this.data.active ? 'active' : ''}>
							<p>{res.name}</p>
							{
								res.badge ?
								<span style={{backgroundColor:res.badgeColor}}>
									{res.badge}
								</span> :
								null
							}
						</a>
					))
				}
			</nav>
		)
	}

	renderList() {
		const goodsList = this.props.$$goods.list

		const wrapper = []
		for (let i = 0; i < Math.ceil(goodsList.length / 2); i++) {
			wrapper.push(i * 2)
		}

		return (
			<div styleName={goodsList.length > 0 ? 'list' : 'empty-list'}>
				{
					goodsList.length > 0 ?
					wrapper.map(res => (
						<div styleName="row" key={res}>
							{
								goodsList[res] ?
								<GoodsItem source={goodsList[res]} /> :
								null
							}
							{
								goodsList[res + 1] ?
								<GoodsItem source={goodsList[res + 1]} /> :
								null
							}
						</div>
					)) :
					<p styleName="empty">该分类下暂无商品</p>
				}
			</div>
		)
	}

	render() {
		return (
			<Layout styleName="view-category">
				<Layout.Header title="全部"
					addonAfter={<NavSpct />} />

				<Layout.Body
					styleName="body"
					errorInfo={this.data.errorInfo}
					loading={this.data.loading}>

					{this.renderAside()}
					
					{this.renderList()}
				</Layout.Body>

				<AppFooter />
			</Layout>
		)
	}
}

export default ViewCategory