import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import CDN from 'src/assets/libs/cdn'
import { Button, Table, Pagination, Loading, Message } from 'element-react'
import { Link } from 'react-router-dom'

@connect
@reactStateData
class ViewGoods extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	getSearch() {
		const search = this.props.location.search.replace(/^\?/, '')
		if (search) {
			return qs.parse(search)
		}
		return {}
	}

	componentDidMount() {
		const search = this.getSearch()
		this.fetch(search.skip)
	}

	changePage = e => {
		const skip = (e - 1) * 10
		this.props.history.replace(`/goods/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		this.data.loading = true
		try {
			this.skip = skip
			await this.props.$goods.fetchList({
				skip
			})
			const count = this.props.$$goods.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
			Message.error(e.msg)
		}
		this.data.loading = false
	}

	submit = async e => {
		this.props.history.push('/goods/detail')
	}

	render() {
		return (
			<div className="view-goods">

				<h1>产品管理</h1>
				
				<Loading loading={this.data.loading}>
					<Table
						className="table"
						columns={[
							{
								label: '排序',
								prop: 'index',
								width: 80,
								align: 'center'
							}, {
								label: '封面',
								width: 160,
								render: data => {
									return <img src={CDN+data.cover} />
								}
							}, {
								label: '名称/描述',
								render: data => {
									return <p>{data.name}<br/>{data.desc}</p>
								}
							}, {
								label: '优质产区/产地',
								width: 140,
								align: 'center',
								render: data => {
									return (
										<div className="status">
										{
											data.origin && data.isImport ?
											<i className="online" /> :
											<i className="offline" />
										}
										{
											data.isImport ?
											data.origin :
											data.origin ?
											data.origin :
											'-'
										}
										</div>
									)
								}
							}, {
								label: '上下架/可购规格',
								width: 150,
								align: 'center',
								render: data => {
									return (
										<div className="status">
										{
											data.online ?
											<i className="online" /> :
											<i className="offline" />
										}
										{
											data.online ?
											'上架' :
											'下架'
										}
										&nbsp;
										({data.skuCount})
										</div>
									)
								}
							}, {
								label: '所属分类',
								width: 120,
								render: data => {
									return <div>
										{
											data.category && data.category.map((res, i) => (
												<p key={i}>{res.name}</p>
											))
										}
									</div>
								}
							}, {
								label: '标签',
								width: 120,
								render: data => {
									return <p className="badge" style={{background:data.badgeColor}}>{data.badge}</p>
								}
							}, {
								label: '',
								width: 150,
								render: data => {
									return (
										<p className="console">
											<Link to={`/goods/detail/${data.id}`}>
												编辑
											</Link>
											<Link to={`/goods/${data.id}/sku/list`}>
												规格管理
											</Link>
										</p>
									)
								}
							}
						]}
						data={this.props.$$goods.list}
						rowClassName={e => e.online || e.FCLonline ? 'online' : 'offline'}
						border={true} />

					<div className="pager">
						<Pagination
							layout="prev, pager, next"
							currentPage={this.skip / 10 + 1}
							total={this.props.$$goods.count}
							onCurrentChange={this.changePage} />
					</div>
				</Loading>

				<Button className="bodybtn" size="large" type="primary" onClick={this.submit}>新增</Button>
			</div>
		)
	}
}

export default ViewGoods