import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'
import Colors from 'src/components/colors'

@connect
@reactStateData
class ViewCategoryDetail extends Component {
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
			const res = await this.props.$category.fetchDetail({
				id
			})
			const data = {}

			data.id = id
			data.index = res.index
			data.online = res.online
			data.badge = res.badge
			data.badgeColor = res.badgeColor
			data.name = res.name

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
				index: this.data.index,
				online: this.data.online,
				badge: this.data.badge,
				badgeColor: this.data.badgeColor,
				name: this.data.name,
			}
			if (this.data.id) {
				await this.props.$category.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$category.create(data)
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
			<div className="view-categoryDetail">
				
				<h1>分类管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>

					<Form.Item label="排序">
						<InputNumber
							defaultValue={this.data.index}
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
						<Colors
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

export default ViewCategoryDetail