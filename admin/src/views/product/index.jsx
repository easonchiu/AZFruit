import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import { Button, Table, Pagination } from 'element-react'
import { Link } from 'react-router-dom'

@connect
@reactStateData
class ViewProduct extends Component {
	constructor(props) {
		super(props)
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
		this.props.history.replace(`/product/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		try {
			this.skip = skip
			await this.props.$product.fetchList({
				skip
			})
			const count = this.props.$$product.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
		}
	}

	submit = async e => {
		this.props.history.push('/product/detail')
	}

	render() {
		return (
			<div className="view-product">

				<h1>产品管理</h1>
				
				<Table
					className="table"
					columns={[
						{
							label: '排序',
							prop: 'index',
							width: 80,
							align: 'center'
						}, {
							label: '名称',
							prop: 'name',
							width: 200,
						}, {
							label: '描述',
							prop: 'desc',
							width: 250,
						}, {
							label: '价格',
							width: 150,
							align: 'center',
							render: data => (data.price / 100) + '元/' + data.unit
						}, {
							label: '整箱价格',
							width: 150,
							align: 'center',
							render: data => (data.FCLprice / 100) + '元/' + data.FCLunit
						}, {
							label: '整箱描述',
							width: 250,
							prop: 'FCLdesc',
						}, {
							label: '上下架及库存',
							width: 200,
							fixed: 'left',
							align: 'center',
							render: data => {
								return (
									<div className="status">
									{
										data.online ?
										<i className="online" /> :
										<i className="offline" />
									}
									<p>{data.stock}{data.unit}</p>
									{
										data.FCLonline ?
										<i className="online" /> :
										<i className="offline" />
									}
									{data.FCLstock}
									{data.FCLunit}
									</div>
								)
							}
						}, {
							label: '',
							width: 80,
							fixed: 'right',
							render: data => {
								return (
									<p className="console">
										<Link to={`/product/detail/${data.id}`}>
											编辑
										</Link>
									</p>
								)
							}
						}
					]}
					data={this.props.$$product.list}
					rowClassName={e => e.online || e.FCLonline ? 'online' : 'offline'}
					border={true} />

				<div className="pager">
					<Pagination
						layout="prev, pager, next"
						currentPage={this.skip / 10 + 1}
						total={this.props.$$product.count}
						onCurrentChange={this.changePage} />
				</div>
				<Button className="bodybtn" size="large" type="primary" onClick={this.submit}>新增</Button>
			</div>
		)
	}
}

export default ViewProduct