import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'
import dateFormat from 'dateformat'

import { Link } from 'react-router-dom'
import { Button, Table, Pagination, Loading } from 'element-react'

@connect
@reactStateData
class ViewOrder extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
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
		this.props.history.replace(`/order/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		this.data.loading = true
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
		this.data.loading = false
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
				
				<Loading loading={this.data.loading}>

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
								width: 180,
								align: 'center',
								render(data) {
									return dateFormat(data.createTime, 'yyyy-mm-dd hh:MM:ss')
								}
							}, {
								label: '订单状态',
								width: 120,
								align: 'center',
								render(data) {
									const status = {
										1: '待支付',
										11: '已支付',
										21: '已发货',
										31: '已完成',
										41: '已评价',
										90: '交易关闭',
									}
									return (
										<div className="status">
											<i
												className={cn({
													waiting: data.status == 1,
													finish: data.status >= 2 && data.status < 90,
													closed: data.status == 90
												})}
											/>
											{status[data.status]}
										</div>
									)
								}
							}, {
								label: '订单金额',
								width: 120,
								align: 'center',
								render(data) {
									return data.totalPrice / 100 + '元'
								}
							}, {
								label: '收货人信息',
								render(data) {
									const address = data.address || {}
									return (
										<div className="address">
											<p>收货地址：{address.city + address.area + address.address}</p>
											<p>联系方式：{address.name + ' ' + address.mobile}</p>
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
						border={true} />

					<div className="pager">
						<Pagination
							layout="prev, pager, next"
							currentPage={this.skip / 10 + 1}
							total={this.props.$$order.count}
							onCurrentChange={this.changePage} />
					</div>

				</Loading>
				
			</div>
		)
	}
}

export default ViewOrder