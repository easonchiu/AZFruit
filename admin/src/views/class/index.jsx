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
class ViewClass extends Component {
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
		this.props.history.replace(`/class/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		try {
			this.skip = skip
			await this.props.$class.fetchList({
				skip
			})
			const count = this.props.$$class.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
		}
	}

	remove = async e => {
		try {
			await this.props.$class.remove({
				id: e.id
			})
			this.fetch(this.skip)
		} catch(e) {
			console.error(e)
		}
	}

	submit = async e => {
		this.props.history.push('/class/detail')
	}

	render() {
		return (
			<div className="view-class">

				<h1>分类管理</h1>

				<Table
					className="table"
					columns={[
						{
							label: '排序',
							prop: 'index',
							width: 80,
							align: 'center'
						}, {
							label: '分类名',
							prop: 'name',
							width: 200,
						}, {
							label: '标签',
							render: data => {
								return <p className="badge" style={{background:data.badgeColor}}>{data.badge}</p>
							}
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
										<Link to={`/class/detail/${data.id}`}>
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
					data={this.props.$$class.list}
					rowClassName={e => e.online ? 'online' : 'offline'}
					border={true} />

				<div className="pager">
					<Pagination
						layout="prev, pager, next"
						currentPage={this.skip / 10 + 1}
						total={this.props.$$class.count}
						onCurrentChange={this.changePage} />
				</div>
				
				<Button className="bodybtn" size="large" type="primary" onClick={this.submit}>新增</Button>
			</div>
		)
	}
}

export default ViewClass