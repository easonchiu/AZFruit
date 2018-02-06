import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import dateFormat from 'dateformat'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'

@connect
@reactStateData
class ViewUserDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			loading: true,
			data: null
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		const id = this.props.match.params.id
		if (id) {
			this.fetch(id)
		} else {
			this.data.loading = false
		}
	}

	async fetch(id) {
		try {
			const res = await this.props.$user.fetchDetail({
				id
			})
			this.setState({
				data: res
			})
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	render() {
		const data = this.state.data || {}

		return (
			<div className="view-userDetail">

				<h1>用户管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>
					<Form.Item label="手机号">
						<p>{data.mobile}</p>
					</Form.Item>

					<Form.Item label="注册时间">
						<p>{dateFormat(data.createTime, 'yyyy-mm-dd HH:MM:ss')}</p>
					</Form.Item>

					<Form.Item label="openid">
						<p>{data.openId}</p>
					</Form.Item>

					<Form.Item label="消费积分" className="inte">
						<p>{data.integral}</p>
						<a href="javascript:;">[查看该用户订单]</a>
					</Form.Item>

					<Form.Item label="收货地址">
						{
							(data.addressList && data.addressList.length) ?
							data.addressList.map((res, i) => (
								<ul key={i} className="item">
									{
										res.id == data.defaultAddress ?
										<li>
											<h6>默认地址</h6>
										</li> :
										null
									}
									<li>
										<label>收货人姓名</label>
										<p>{res.name}</p>
									</li>
									<li>
										<label>手机号</label>
										<p>{res.mobile}</p>
									</li>
									<li>
										<label>收货地址</label>
										<p>{res.city + res.area + res.address}</p>
									</li>
									<li>
										<label>位于</label>
										<p>{res.areaAddress}</p>
									</li>
								</ul>
							)) :
							'-'
						}
					</Form.Item>

					<Form.Item label="优惠券">
						{
							(data.couponList && data.couponList.length) ?
							data.couponList.map((res, i) => {
								return (
									<ul key={i} className="item">
										<li>
											<label>券名称</label>
											<p>{res.name}</p>
										</li>
										<li>
											<label>是否已使用</label>
											<p>{res.used ? '是' : '否'}</p>
										</li>
										<li>
											<label>价值</label>
											<p>{res.worth / 100}元</p>
										</li>
										<li>
											<label>使用条件</label>
											<p>满{res.condition / 100}元</p>
										</li>
										<li>
											<label>批次</label>
											<p>{res.batch}</p>
										</li>
										<li>
											<label>过期时间</label>
											<p>{dateFormat(res.expiredTime, 'yyyy-mm-dd HH:MM:ss')}</p>
										</li>
									</ul>
								)
							}) :
							'-'
						}
					</Form.Item>
				</Form>

				<div className="btns">
					<Button size="large" onClick={this.props.history.goBack}>返回</Button>
				</div>
				
				</Loading>
			</div>
		)
	}
}

export default ViewUserDetail