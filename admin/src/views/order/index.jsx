import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import { Link } from 'react-router-dom'
import { Button, Table, Pagination } from 'element-react'

@connect
@reactStateData
class ViewOrder extends Component {
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
		this.props.history.replace(`/order/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		try {
			this.skip = skip
			await this.props.$order.fetchList({
				skip
			})
			const count = this.props.$$order.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
		}
	}

	remove = async e => {
		try {
			await this.props.$order.remove({
				id: e.id
			})
			this.fetch(this.skip)
		} catch(e) {
			console.error(e)
		}
	}

	submit = async e => {
		this.props.history.push('/order/detail')
	}

	render() {
		return (
			<div className="view-order">

				<h1>订单管理</h1>

				<Table
					className="table"
					columns={[
						{
							label: '排序',
							prop: 'index',
							width: 80,
							align: 'center'
						}, {
							label: '描述',
							prop: 'desc',
							width: 200,
						}, {
							label: '图片地址',
							prop: 'uri'
						}, {
							label: '跳转链接',
							prop: 'link'
						}, {
							label: '状态',
							prop: 'online',
							width: 120,
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
										'使用中' :
										'停用'
									}
									</div>
								)
							}
						}, {
							label: '',
							width: 150,
							render: data => {
								return (
									<p className="console">
										<Link to={`/order/detail/${data.id}`}>
											查看详情
										</Link>
									</p>
								)
							}
						}
					]}
					data={this.props.$$order.list}
					rowClassName={e => e.online ? 'online' : 'offline'}
					border={true} />

				<div className="pager">
					<Pagination
						layout="prev, pager, next"
						currentPage={this.skip / 10 + 1}
						total={this.props.$$order.count}
						onCurrentChange={this.changePage} />
				</div>
				
			</div>
		)
	}
}

export default ViewOrder