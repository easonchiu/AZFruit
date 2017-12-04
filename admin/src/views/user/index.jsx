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
class ViewUser extends Component {
	constructor(props) {
		super(props)

		this.pid = props.match.params.pid

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
		this.props.history.replace(`/user/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		try {
			this.skip = skip
			await this.props.$user.fetchList({
				skip
			})
			const count = this.props.$$user.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
			Message.error(e.msg)
		}
	}

	render() {
		return (
			<div className="view-user">
				<h1>用户管理</h1>

				<Loading loading={this.data.loading}>

					<h6>用户总数 {this.props.$$user.count}人</h6>
				
					<Table
						className="table"
						columns={[
							{
								label: '手机号',
								prop: 'mobile',
								width: 150,
								align: 'center'
							}, {
								label: '积分',
								prop: 'integral',
							}, {
								label: '',
								width: 150,
								render: data => {
									return (
										<p className="console">
											<Link to={`/user/detail/${data.id}`}>
												查看
											</Link>
										</p>
									)
								}
							}
						]}
						data={this.props.$$user.list}
						border={true}
					/>

					<div className="pager">
						<Pagination
							layout="prev, pager, next"
							currentPage={this.skip / 10 + 1}
							total={this.props.$$user.count}
							onCurrentChange={this.changePage} />
					</div>

				</Loading>
			</div>
		)
	}
}

export default ViewUser