import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'
import Colors from 'src/components/colors'

@connect
@reactStateData
class ViewPostageDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			
			km: 0,
			weight: 500,
			postage: 0,
			eachWeight: 0,
			eachPostage: 0,
			freePostage: 999999,
			online: false,

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
			const res = await this.props.$postage.fetchDetail({
				id
			})
			this.data.id = id
			this.data.km = res.km
			this.data.weight = res.weight
			this.data.postage = res.postage
			this.data.eachWeight = res.eachWeight
			this.data.eachPostage = res.eachPostage
			this.data.freePostage = res.freePostage
			this.data.online = res.online
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
				km: this.data.km,
				weight: this.data.weight,
				postage: this.data.postage,
				eachWeight: this.data.eachWeight,
				eachPostage: this.data.eachPostage,
				freePostage: this.data.freePostage,
				online: this.data.online,
			}
			if (this.data.id) {
				await this.props.$postage.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$postage.create(data)
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
			<div className="view-postageDetail">
				
				<h1>运费规则管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={150}>

					<Form.Item label="超出距离">
						<InputNumber
							defaultValue={this.data.km}
							value={this.data.km}
							onChange={this.valueChange.bind(this, 'km')} />
						<em>单位：公里</em>
					</Form.Item>

					<Form.Item label="重量上限">
						<InputNumber
							defaultValue={this.data.weight}
							value={this.data.weight}
							onChange={this.valueChange.bind(this, 'weight')} />
						<em>单位：克</em>
					</Form.Item>

					<Form.Item label="基础运费">
						<InputNumber
							defaultValue={this.data.postage}
							value={this.data.postage}
							onChange={this.valueChange.bind(this, 'postage')} />
						<em>单位：分</em>
						<em style={{color:'#ff4949'}}>当前{this.data.postage/100}元</em>
					</Form.Item>

					<Form.Item label="超出后每档重量">
						<InputNumber
							defaultValue={this.data.eachWeight}
							value={this.data.eachWeight}
							onChange={this.valueChange.bind(this, 'eachWeight')} />
						<em>单位：克</em>
						<em>超出重量上限后会按该设置递增价格，直到更远的距离规则匹配</em>
					</Form.Item>

					<Form.Item label="每档重量的价格">
						<InputNumber
							defaultValue={this.data.eachPostage}
							value={this.data.eachPostage}
							onChange={this.valueChange.bind(this, 'eachPostage')} />
						<em>单位：分</em>
						<em style={{color:'#ff4949'}}>当前{this.data.eachPostage/100}元</em>
					</Form.Item>

					<Form.Item label="满消费免运费">
						<InputNumber
							defaultValue={this.data.freePostage}
							value={this.data.freePostage}
							onChange={this.valueChange.bind(this, 'freePostage')} />
						<em>单位：分</em>
						<em style={{color:'#ff4949'}}>当前{this.data.freePostage/100}元</em>
					</Form.Item>

					<Form.Item label="使用中">
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

export default ViewPostageDetail