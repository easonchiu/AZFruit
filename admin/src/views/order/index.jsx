import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'
import dateFormat from 'dateformat'

import { Link } from 'react-router-dom'
import { Button, Table, Pagination, Loading, Tabs } from 'element-react'

@connect
@reactStateData
class ViewOrder extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			type: '1'
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
		this.data.type = search.type || '1'
		this.fetch(search.skip, search.type)
	}

	changePage = e => {
		const skip = (e - 1) * 10
		this.props.history.replace(`/order/list?skip=${skip}`)
		this.fetch(skip, this.data.type)
	}

	async fetch(skip = 0, type = '1') {
		this.data.loading = true
		try {
			this.skip = skip
			await this.props.$order.fetchList({
				skip,
				type
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

	submit = async e => {
		this.props.history.push('/order/detail')
	}

	renderTables() {
		return (
			<div>
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
								return dateFormat(data.createTime, 'yyyy-mm-dd HH:MM:ss')
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
							label: '支付金额',
							width: 120,
							align: 'center',
							render(data) {
								return data.paymentPrice / 100 + '元'
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
			</div>
		)
	}

	onTabClick = e => {
		this.data.type = e.props.name
		this.props.history.replace(`/order/list?skip=${this.skip}&type=${e.props.name}`)
		this.fetch(this.skip, e.props.name)
	}

	render() {
		return (
			<div className="view-order">

				<h1>订单管理</h1>
				
				<Loading loading={this.data.loading}>
					
					<Tabs activeName={this.data.type} onTabClick={this.onTabClick}>
						<Tabs.Pane label="待处理订单" name={'1'} />
						<Tabs.Pane label="历史订单" name={'2'} />
					</Tabs>

					{this.renderTables()}

				</Loading>
				
			</div>
		)
	}
}

export default ViewOrder