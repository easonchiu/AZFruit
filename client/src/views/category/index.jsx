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

	// 获取数据
	async fetch() {
		this.data.loading = true
		try {
			// 获取菜单列表
			await this.props.$category.fetchList()

			// 从网址中获取当前菜单的id
			const id = this.props.match.params.id

			// 设置当前菜单
			if (id) {
				this.props.$$category.list.forEach((res, i) => {
					if (res.id === id) {
						this.data.active = i
					}
				})
			}

			// 获取当前菜单的数据
			const current = id ? {id} : this.props.$$category.list[0]
			if (current) {
				await this.props.$goods.fetchList(current.id)
			}
		} catch(e) {
			console.error(e)
			this.data.errorInfo = e.msg
		}
		this.data.loading = false
	}

	// 侧边分类点击
	categoryClick = async res => {
		if (res.i == this.data.active) {
			return false
		}

		this.props.history.replace(`/category/${res.id}`)

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
	
	// 渲染侧栏
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
	
	// 渲染产品列表
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
				<Layout.Header title="全部" />

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