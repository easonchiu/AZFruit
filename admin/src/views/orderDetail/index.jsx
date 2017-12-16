import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'

@connect
@reactStateData
class ViewOrderDetail extends Component {
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
			const res = await this.props.$order.fetchDetail({
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
			<div className="view-orderDetail">

				<h1>订单管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>
					<Form.Item label="手机号">
						<p>{data.mobile}</p>
					</Form.Item>
				</Form>

				<div className="btns">
					<Button type="primary" size="large" onClick={this.submit}>修改订单</Button>
					<Button size="large" onClick={this.props.history.goBack}>返回</Button>
				</div>
				
				</Loading>
			</div>
		)
	}
}

export default ViewOrderDetail