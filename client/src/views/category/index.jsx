import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import Layout from 'src/auto/layout'
import Toast from 'src/auto/toast'
import Loading from 'src/auto/loading'
import AppFooter from 'src/components/appFooter'
import GoodsItem from 'src/components/goodsItem'

@connect
@reactStateData
class ViewCategory extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			errorInfo: '',
			active: 0
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
			<nav className="category">
				{
					categoryList.map((res, i) => (
						<a href="javascript:;" key={res.id}
							onClick={this.categoryClick.bind(this, {...res,i})}
							className={i == this.data.active ? 'active' : ''}>
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
			<div className={goodsList.length > 0 ? 'list' : 'empty-list'}>
				{
					goodsList.length > 0 ?
					wrapper.map(res => (
						<div className="row" key={res}>
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
					<p className="empty">该分类下暂无商品</p>
				}
			</div>
		)
	}

	render() {
		return (
			<Layout className="view-category">
				<Layout.Header title="全部" />

				<Layout.Body
					className="body"
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