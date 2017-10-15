import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import { Link } from 'react-router-dom'
import { Button, Table, Pagination, Loading } from 'element-react'

@connect
@reactStateData
class ViewPostage extends Component {
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
		this.props.history.replace(`/postage/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		this.data.loading = true
		try {
			this.skip = skip
			await this.props.$postage.fetchList({
				skip
			})
			const count = this.props.$$postage.count
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
			await this.props.$postage.remove({
				id: e.id
			})
			this.fetch(this.skip)
		} catch(e) {
			console.error(e)
		}
	}

	submit = async e => {
		this.props.history.push('/postage/detail')
	}

	render() {
		return (
			<div className="view-postage">

				<h1>运费规则管理</h1>
				
				<Loading loading={this.data.loading}>
				<Table
					className="table"
					columns={[
						{
							label: '超出公里数(公里)',
							prop: 'km',
							width: 150,
							align: 'center'
						}, {
							label: '基础重量(克)',
							prop: 'weight',
							align: 'center',
							width: 120,
						}, {
							label: '运费',
							render: data => {
								return data.postage / 100 + '元'
							}
						}, {
							label: '超出后每档重量(克)',
							prop: 'eachWeight',
							align: 'center',
							width: 180,
						}, {
							label: '每档重量的价格',
							align: 'center',
							width: 150,
							render: data => {
								return data.eachPostage / 100 + '元'
							}
						}, {
							label: '满消费免运费',
							width: 150,
							align: 'center',
							render: data => {
								return data.freePostage / 100 + '元'
							}
						}, {
							label: '使用中',
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
										<Link to={`/postage/detail/${data.id}`}>
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
					data={this.props.$$postage.list}
					rowClassName={e => e.online ? 'online' : 'offline'}
					border={true} />

				<div className="pager">
					<Pagination
						layout="prev, pager, next"
						currentPage={this.skip / 10 + 1}
						total={this.props.$$postage.count}
						onCurrentChange={this.changePage} />
				</div>
				</Loading>
				
				<Button className="bodybtn" size="large" type="primary" onClick={this.submit}>新增</Button>
			</div>
		)
	}
}

export default ViewPostage