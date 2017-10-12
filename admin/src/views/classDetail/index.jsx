import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, Switch, Message, Loading } from 'element-react'

@connect
@reactStateData
class ViewClassDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			index: 0,
			online: false,
			badge: '',
			badgeColor: '',
			name: '',
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
			const res = await this.props.$class.fetchDetail({
				id
			})
			this.data.id = id
			this.data.index = res.index
			this.data.online = res.online
			this.data.badge = res.badge
			this.data.badgeColor = res.badgeColor
			this.data.name = res.name
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
				index: this.data.index,
				online: this.data.online,
				badge: this.data.badge,
				badgeColor: this.data.badgeColor,
				name: this.data.name,
			}
			if (this.data.id) {
				await this.props.$class.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$class.create(data)
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
			<div className="view-classDetail">
				
				<h1>分类管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>

					<Form.Item label="排序">
						<Input
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
					</Form.Item>

					<Form.Item label="分类名">
						<Input
							value={this.data.name}
							onChange={this.valueChange.bind(this, 'name')} />
					</Form.Item>

					<Form.Item label="标签">
						<Input
							value={this.data.badge}
							onChange={this.valueChange.bind(this, 'badge')} />
					</Form.Item>

					<Form.Item label="标签底色">
						<Input
							value={this.data.badgeColor}
							onChange={this.valueChange.bind(this, 'badgeColor')} />
					</Form.Item>

					<Form.Item label="状态">
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

export default ViewClassDetail