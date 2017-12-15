import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

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

					<Form.Item label="消费积分" className="inte">
						<p>{data.integral}</p>
						<a href="javascript:;">[查看该用户订单]</a>
					</Form.Item>

					<Form.Item label="收货地址">
						{
							data.addressList && data.addressList.map((res, i) => (
								<ul key={i} className="item">
									{
										res._id == data.defaultAddress ?
										<li>默认地址：</li> :
										null
									}
									<li><span>收货人姓名：</span>{res.name}</li>
									<li><span>手机号：</span>{res.mobile}</li>
									<li><span>收货地址：</span>{res.city + res.area + res.address}</li>
									<li><span>位于：</span>{res.areaAddress}</li>
								</ul>
							))
						}
					</Form.Item>

					<Form.Item label="可使用优惠券">
						{
							data.couponList && data.couponList.map((res, i) => {
								if (res.used) {
									return null
								}
								return (
									<ul key={i} className="item">
										<li><span>券名称：</span>{res.name}</li>
										<li><span>价值：</span>{res.worth / 100}元</li>
										<li><span>使用条件：</span>满{res.condition / 100}元</li>
										<li><span>批次：</span>{res.batch}</li>
										<li><span>过期时间：</span>{res.expiredTime}</li>
									</ul>
								)
							})
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