import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'
import Upload from 'src/components/upload'

@connect
@reactStateData
class ViewQuickDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			index: 0,
			link: '',
			online: false,
			uri: '',
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
			const res = await this.props.$quick.fetchDetail({
				id
			})
			this.data.id = id
			this.data.index = res.index
			this.data.link = res.link
			this.data.online = res.online
			this.data.uri = res.uri
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
				link: this.data.link,
				online: this.data.online,
				uri: this.data.uri,
				name: this.data.name,
			}
			if (this.data.id) {
				await this.props.$quick.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$quick.create(data)
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
			<div className="view-quickDetail">
				
				<h1>首页快捷入口管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>

					<Form.Item label="排序">
						<InputNumber
							defaultValue={this.data.index}
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
					</Form.Item>

					<Form.Item label="名称">
						<Input
							value={this.data.name}
							onChange={this.valueChange.bind(this, 'name')} />
					</Form.Item>

					<Form.Item label="图标">
						<Upload
							value={this.data.uri}
							onChange={this.valueChange.bind(this, 'uri')} />
					</Form.Item>

					<Form.Item label="链接">
						<Input
							value={this.data.link}
							onChange={this.valueChange.bind(this, 'link')} />
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

export default ViewQuickDetail