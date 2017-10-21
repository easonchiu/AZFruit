import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import { Button, Table, Pagination, Loading, Message } from 'element-react'
import { Link } from 'react-router-dom'

@connect
@reactStateData
class ViewProductSpec extends Component {
	constructor(props) {
		super(props)

		this.pid = props.match.params.pid

		this.setData({
			loading: false,

			pname: '',
			pdesc: ''
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
		this.props.history.replace(`/product/${this.pid}/spec/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		this.data.loading = true
		try {
			this.skip = skip
			const res = await this.props.$product.fetchDetail({
				id: this.pid
			})
			
			this.data.pname = res.name
			this.data.pdesc = res.desc

			await this.props.$productSpec.fetchList({
				skip,
				pid: this.pid
			})
			const count = this.props.$$productSpec.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	remove = async e => {
		try {
			await this.props.$productSpec.remove({
				sid: e.id,
				pid: this.pid
			})
			this.fetch(this.skip)
		} catch(e) {
			console.error(e)
		}
	}

	submit = async e => {
		this.props.history.push(`/product/${this.pid}/spec/detail`)
	}

	render() {
		return (
			<div className="view-productSpec">

				<h1>产品规格管理</h1>
				
				<Loading loading={this.data.loading}>

				<h6>{this.data.pname} - {this.data.pdesc}</h6>

				<Table
					className="table"
					columns={[
						{
							label: '规格描述',
							prop: 'desc',
						}, {
							label: '销量',
							width: 100,
							align: 'center',
							prop: 'sellCount',
						}, {
							label: '库存',
							width: 100,
							align: 'center',
							prop: 'stock'
						}, {
							label: '重量',
							width: 100,
							align: 'center',
							prop: 'weight'
						}, {
							label: '计量单位',
							width: 120,
							align: 'center',
							prop: 'unit'
						}, {
							label: '价格',
							width: 150,
							align: 'center',
							prop: 'price'
						}, {
							label: '原价',
							width: 150,
							align: 'center',
							prop: 'prePrice'
						}, {
							label: '上下架',
							width: 100,
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
									</div>
								)
							}
						}, {
							label: '',
							width: 150,
							render: data => {
								return (
									<p className="console">
										<Link to={`/product/${this.pid}/spec/detail/${data.id}`}>
											编辑
										</Link>
										<a href="javascript:;" onClick={this.remove.bind(this, data)}>
											删除
										</a>
									</p>
								)
							}
						}
					]}
					data={this.props.$$productSpec.list}
					rowClassName={e => e.online || e.FCLonline ? 'online' : 'offline'}
					border={true} />

				<div className="pager">
					<Pagination
						layout="prev, pager, next"
						currentPage={this.skip / 10 + 1}
						total={this.props.$$productSpec.count}
						onCurrentChange={this.changePage} />
				</div>
				</Loading>

				<div className="btns">
					<Button size="large" type="primary" onClick={this.submit}>新增规格</Button>
					<Button size="large" onClick={this.props.history.goBack}>返回</Button>
				</div>

				
			</div>
		)
	}
}

export default ViewProductSpec