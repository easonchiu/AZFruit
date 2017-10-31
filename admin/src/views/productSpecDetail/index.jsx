import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'
import Colors from 'src/components/colors'

@connect
@reactStateData
class ViewProductSpecDetail extends Component {
	constructor(props) {
		super(props)

		this.pid = this.props.match.params.pid

		this.setData({
			id: '',
			loading: true,

			sid: '',
			desc: '',
			stock: 0,
			unit: '',
			weight: 500,
			price: 0,
			prePrice: 0,
			online: false
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		const sid = this.props.match.params.sid
		if (sid) {
			this.fetch(sid)
		} else {
			this.data.loading = false
		}
	}

	async fetch(sid) {
		try {
			const res = await this.props.$productSpec.fetchDetail({
				sid
			})
			const data = {}

			data.sid = sid
			data.desc = res.desc
			data.stock = res.stock
			data.unit = res.unit
			data.weight = res.weight
			data.price = res.price
			data.prePrice = res.prePrice
			data.online = res.online

			this.setState({
				...data
			})
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	valueChange(target, value) {
		this.data[target] = value
	}

	submit = async e => {
		this.data.loading = true
		try {
			const data = {
				pid: this.pid,
				desc: this.data.desc,
				stock: this.data.stock,
				unit: this.data.unit,
				weight: this.data.weight,
				price: this.data.price * 100, // 转为分，数据库中用分为单位
				prePrice: this.data.prePrice * 100, // 转为分，数据库中用分为单位
				online: this.data.online,
			}
			if (this.data.sid) {
				await this.props.$productSpec.update({
					sid: this.data.sid,
					...data
				})
			} else {
				await this.props.$productSpec.create(data)
			}
			this.props.history.goBack()
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	render() {
		const data = this.data
		return (
			<div className="view-productSpecDetail">

				<h1>产品规格管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>
					<Form.Item label="规格描述">
						<Input
							value={this.data.desc}
							onChange={this.valueChange.bind(this, 'desc')} />
					</Form.Item>

					<Form.Item label="库存">
						<InputNumber
							defaultValue={this.data.stock}
							value={this.data.stock}
							onChange={this.valueChange.bind(this, 'stock')} />
					</Form.Item>

					<Form.Item label="计量单位">
						<Input
							value={this.data.unit}
							onChange={this.valueChange.bind(this, 'unit')} />
					</Form.Item>

					<Form.Item label="重量">
						<InputNumber
							defaultValue={this.data.weight}
							value={this.data.weight}
							onChange={this.valueChange.bind(this, 'weight')} />
						<em>单位：克</em>
					</Form.Item>

					<Form.Item label="价格">
						<InputNumber
							defaultValue={this.data.price}
							value={this.data.price}
							onChange={this.valueChange.bind(this, 'price')} />
						<em>单位：元</em>
					</Form.Item>

					<Form.Item label="原价">
						<InputNumber
							defaultValue={this.data.prePrice}
							value={this.data.prePrice}
							onChange={this.valueChange.bind(this, 'prePrice')} />
						<em>单位：元</em>
					</Form.Item>

					<Form.Item label="上下架">
						<Switch
							value={this.data.online}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'online')} />
					</Form.Item>
				</Form>

				<div className="btns">
					<Button type="primary" size="large" onClick={this.submit}>提交</Button>
					<Button size="large" onClick={this.props.history.goBack}>取消</Button>
				</div>

				</Loading>

			</div>
		)
	}
}

export default ViewProductSpecDetail