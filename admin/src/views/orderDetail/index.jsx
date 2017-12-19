import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import dateFormat from 'dateformat'

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
		const data = this.state.data

		if (!data) return null

		return (
			<div className="view-orderDetail">

				<h1>订单管理</h1>
				<Loading loading={this.data.loading}>
				
				<h6>订单信息</h6>
				<Form labelWidth={120}>
					<Form.Item label="订单号">
						<p>{data.orderNo}</p>
					</Form.Item>

					<Form.Item label="微信订单号">
						<p>{data.wxOrderNo}</p>
					</Form.Item>
					
					<Form.Item label="订单状态">
						<p>
							{
								{
									1: '待支付',
									11: '已支付',
									21: '已发货',
									31: '已完成',
									41: '已评价',
									90: '交易关闭',
								}[data.status]
							}
						</p>
					</Form.Item>

					<Form.Item label="下单时间">
						<p>{dateFormat(data.createTime, 'yyyy-mm-dd hh:MM:ss')}</p>
					</Form.Item>

					<Form.Item label="支付时间">
						<p>
							{
								data.paymentTime ?
								dateFormat(data.paymentTime, 'yyyy-mm-dd hh:MM:ss'):
								'-'
							}
						</p>
					</Form.Item>
				</Form>

				<h6>购买商品信息</h6>
				<Form labelWidth={120}>
					{
						data.goodsList.map((res, i) => (
							<Form.Item label={'#' + (i+1)}>
								<ul className="item">
									<li><span>品名：</span>{res.name} - {res.skuName}</li>
									<li><span>购买数量：</span>{res.amount}{res.unit}</li>
									<li><span>价格：</span>单价{res.price}，总价{res.totalPrice}</li>
								</ul>
							</Form.Item>
						))
					}
				</Form>

				<h6>费用信息</h6>
				<Form labelWidth={120}>
					<Form.Item label="商品总价">
						<p>{data.totalPrice / 100}元</p>
					</Form.Item>

					<Form.Item label="邮费">
						<span>{data.postage / 100}元 ({data.totalWeight / 500}斤，{Math.round(data.distance / 100) / 10}公里)</span>
					</Form.Item>

					<Form.Item label="需要支付">
						<p>{data.needPayment / 100}元</p>
					</Form.Item>
				</Form>

				<h6>收货人信息</h6>
				<Form labelWidth={120}>
					<Form.Item label="收货人">
						<p>{data.name}</p>
					</Form.Item>

					<Form.Item label="收货人手机号">
						<p>{data.mobile}</p>
					</Form.Item>

					<Form.Item label="收货人手机号">
						<p>{data.city + data.area + data.address}</p>
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

export default ViewOrderDetail