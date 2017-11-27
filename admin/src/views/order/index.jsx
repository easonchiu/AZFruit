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
							label: '订单号',
							prop: 'orderNo',
							width: 160,
							align: 'center'
						}, {
							label: '下单时间',
							prop: 'createTime',
							width: 220,
						}, {
							label: '收货地址',
							width: 220,
							render(data) {
								return data.city + data.area + data.address
							}
						}, {
							label: '订单状态',
							render(data) {
								return data.status
							}
						}
					]}
					data={this.props.$$order.list}
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