import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Select, Switch, Message, Loading } from 'element-react'

@connect
@reactStateData
class ViewCouponDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			name: '',
			flag: '',
			batch: '',
			amount: 1000,
			payment: 120,
			worth: 20,
			condition: 0,
			online: false,
			expiredTime: 7,
			loading: true
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
			const res = await this.props.$coupon.fetchDetail({
				id
			})
			const data = {}

			data.id = id
			data.name = res.name
			data.flag = res.flag
			data.batch = res.batch
			data.amount = res.amount
			data.payment = res.payment
			data.worth = res.worth / 100
			data.condition = res.condition / 100
			data.expiredTime = res.expiredTime
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

	valueChange(e, target) {
		this.data[e] = target
	}

	submit = async e => {
		this.data.loading = true
		try {
			const data = {
				name: this.data.name,
				flag: this.data.flag,
				batch: this.data.batch,
				amount: this.data.amount,
				payment: this.data.payment,
				worth: this.data.worth,
				condition: this.data.condition,
				expiredTime: this.data.expiredTime,
				online: this.data.online
			}
			if (this.data.id) {
				await this.props.$coupon.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$coupon.create(data)
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
			<div className="view-couponDetail">
				
				<h1>优惠券管理</h1>
				<Loading loading={this.data.loading}>
				
					<Form labelWidth={120}>

						<Form.Item label="优惠券名称">
							<Input
								value={this.data.name}
								disabled={this.data.id != ''}
								onChange={this.valueChange.bind(this, 'name')}
							/>
						</Form.Item>

						<Form.Item label="批次号">
							<Input
								value={this.data.batch}
								disabled={this.data.id != ''}
								onChange={this.valueChange.bind(this, 'batch')}
							/>
						</Form.Item>

						<Form.Item label="发放数量">
							<InputNumber
								defaultValue={this.data.amount}
								value={this.data.amount}
								disabled={this.data.id != ''}
								onChange={this.valueChange.bind(this, 'amount')}
							/>
							<em>使用完自动切换到非使用状态</em>
						</Form.Item>

						<Form.Item label="可抵扣金额">
							<InputNumber
								defaultValue={this.data.worth}
								value={this.data.worth}
								disabled={this.data.id != ''}
								onChange={this.valueChange.bind(this, 'worth')}
							/>
							<em>单位：元</em>
						</Form.Item>

						<Form.Item label="使用条件">
							<InputNumber
								defaultValue={this.data.condition}
								value={this.data.condition}
								disabled={this.data.id != ''}
								onChange={this.valueChange.bind(this, 'condition')}
							/>
							<em>单位：元 即消费满多少元可使用</em>
						</Form.Item>

						<Form.Item label="发放方式">
							<Select
								value={this.data.flag}
								disabled={this.data.id != ''}
								onChange={this.valueChange.bind(this, 'flag')}>
								<Select.Option label="注册成功即发放" value={1} />
								{/*<Select.Option label="下单完成后发放" value={2} />*/}
							</Select>
						</Form.Item>
						
						<Form.Item label="过期期限">
							<InputNumber
								min="1"
								max="90"
								disabled={this.data.id != ''}
								defaultValue={this.data.expiredTime}
								value={this.data.expiredTime}
								onChange={this.valueChange.bind(this, 'expiredTime')}
							/>
							<em>单位：天 即领取后几天过期</em>
						</Form.Item>
						
						
						{
							this.data.flag == 2 ?
							<Form.Item label="下单金额">
								<InputNumber
									defaultValue={this.data.payment}
									value={this.data.payment}
									onChange={this.valueChange.bind(this, 'payment')}
								/>
								<em>单位：元</em>
							</Form.Item> :
							null
						}

						<Form.Item label="是否使用">
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

export default ViewCouponDetail