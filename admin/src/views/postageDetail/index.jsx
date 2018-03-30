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
			postage: 0,
			freePostage: 0,
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

			const data = {}

			data.id = id
			data.km = res.km
			data.postage = res.postage / 100
			data.freePostage = res.freePostage / 100
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
				km: this.data.km,
				postage: this.data.postage * 100,
				freePostage: this.data.freePostage * 100,
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

					<Form.Item label="多少公里内">
						<InputNumber
							defaultValue={this.data.km}
							value={this.data.km}
							onChange={this.valueChange.bind(this, 'km')} />
						<em>单位：公里</em>
					</Form.Item>

					<Form.Item label="运费">
						<InputNumber
							defaultValue={this.data.postage}
							value={this.data.postage}
							onChange={this.valueChange.bind(this, 'postage')} />
						<em>单位：元</em>
					</Form.Item>

					<Form.Item label="满消费免运费">
						<InputNumber
							defaultValue={this.data.freePostage}
							value={this.data.freePostage}
							onChange={this.valueChange.bind(this, 'freePostage')} />
						<em>单位：元</em>
						<em style={{color:'#ff4400'}}>0元 = 不管买多少东西都 <strong>收取运费</strong></em>
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