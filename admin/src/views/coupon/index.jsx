import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import CDN from 'src/assets/libs/cdn'
import { Button, Table, Pagination, Loading, Message } from 'element-react'
import { Link } from 'react-router-dom'

@connect
@reactStateData
class ViewCoupon extends Component {
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
		this.props.history.replace(`/coupon/list?skip=${skip}`)
		this.fetch(skip)
	}

	async fetch(skip = 0) {
		this.data.loading = true
		try {
			this.skip = skip
			await this.props.$coupon.fetchList({
				skip
			})
			const count = this.props.$$coupon.count
			if (skip > 0 && skip >= count) {
				this.changePage(Math.ceil(count / 10))
			}
		} catch(e) {
			console.error(e)
			Message.error(e.msg)
		}
		this.data.loading = false
	}

	submit = async e => {
		this.props.history.push('/coupon/detail')
	}

	render() {
		return (
			<div className="view-coupon">
				<h1>优惠券管理</h1>

				<Loading loading={this.data.loading}>
					<Table
						className="table"
						columns={[
							{
								label: '名称',
								prop: 'name'
							}, {
								label: '发放方式',
								width: 150,
								render: data => {
									return ['注册成功即发放'][data.flag - 1]
								}
							}, {
								label: '批次号',
								width: 160,
								prop: 'batch'
							}, {
								label: '发放量',
								width: 90,
								align: 'center',
								prop: 'amount'
							}, {
								label: '已领取',
								width: 90,
								align: 'center',
								prop: 'handOutAmount'
							}, {
								label: '已使用',
								width: 90,
								align: 'center',
								prop: 'usedAmount'
							}, {
								label: '可抵扣',
								width: 90,
								align: 'center',
								render: data => data.worth / 100 + '元'
							}, {
								label: '使用条件',
								width: 100,
								align: 'center',
								render: data => data.condition / 100 + '元'
							}, {
								label: '过期期限',
								width: 100,
								align: 'center',
								render: data => data.expiredTime + '天'
							}, {
								label: '状态',
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
											'使用中' :
											'停用'
										}
										</div>
									)
								}
							}, {
								label: '',
								width: 80,
								render: data => {
									return (
										<p className="console">
											<Link to={`/coupon/detail/${data.id}`}>
												编辑
											</Link>
										</p>
									)
								}
							}
						]}
						data={this.props.$$coupon.list}
						rowClassName={e => e.online ? 'online' : 'offline'}
						border={true} />

					<div className="pager">
						<Pagination
							layout="prev, pager, next"
							currentPage={this.skip / 10 + 1}
							total={this.props.$$coupon.count}
							onCurrentChange={this.changePage} />
					</div>
				</Loading>

				<Button className="bodybtn" size="large" type="primary" onClick={this.submit}>新增种类</Button>
			</div>
		)
	}
}

export default ViewCoupon