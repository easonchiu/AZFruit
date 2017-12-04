import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import CDN from 'src/assets/libs/cdn'
import { Link } from 'react-router-dom'
import { Button, Table, Pagination, Loading, Message } from 'element-react'

@connect
@reactStateData
class ViewBanner extends Component {
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
		this.props.history.replace(`/banner/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		this.data.loading = true
		try {
			this.skip = skip
			await this.props.$banner.fetchList({
				skip
			})
			const count = this.props.$$banner.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
			Message.error(e.msg)
		}
		this.data.loading = false
	}

	remove = async e => {
		try {
			await this.props.$banner.remove({
				id: e.id
			})
			this.fetch(this.skip)
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
	}

	submit = async e => {
		this.props.history.push('/banner/detail')
	}

	render() {
		return (
			<div className="view-banner">

				<h1>Banner管理</h1>
				
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
							label: '描述',
							prop: 'desc',
							width: 200,
						}, {
							label: '图片',
							align: 'center',
							render: data => {
								return <img src={CDN+data.uri} />
							}
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
										<Link to={`/banner/detail/${data.id}`}>
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
					data={this.props.$$banner.list}
					rowClassName={e => e.online ? 'online' : 'offline'}
					border={true} />

				<div className="pager">
					<Pagination
						layout="prev, pager, next"
						currentPage={this.skip / 10 + 1}
						total={this.props.$$banner.count}
						onCurrentChange={this.changePage} />
				</div>

				</Loading>
				
				<Button className="bodybtn" size="large" type="primary" onClick={this.submit}>新增</Button>
			</div>
		)
	}
}

export default ViewBanner