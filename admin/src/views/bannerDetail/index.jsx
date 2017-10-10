import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, Switch } from 'element-react'

@connect
@reactStateData
class ViewBannerDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			index: 0,
			link: '',
			online: false,
			uri: '',
			desc: ''
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		const id = this.props.match.params.id
		if (id) {
			this.fetch(id)
		}
	}

	async fetch(id) {
		try {
			const res = await this.props.$banner.fetchDetail({
				id
			})
			this.data.id = id
			this.data.index = res.index
			this.data.link = res.link
			this.data.online = res.online
			this.data.uri = res.uri
			this.data.desc = res.desc
		} catch(e) {
			console.error(e)
		}
	}

	valueChange(e, target) {
		this.data[e] = target
	}

	submit = async e => {
		try {
			const data = {
				index: this.data.index,
				link: this.data.link,
				online: this.data.online,
				uri: this.data.uri,
				desc: this.data.desc,
			}
			if (this.data.id) {
				await this.props.$banner.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$banner.create(data)
			}
			this.props.history.goBack()
		} catch(e) {
			console.error(e)
		}
	}

	render() {
		const data = this.data
		return (
			<div className="view-bannerDetail">

				<h1>Banner管理</h1>
				
				<Form labelWidth={80}>

					<Form.Item label="排序">
						<Input
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
					</Form.Item>

					<Form.Item label="描述">
						<Input
							value={this.data.desc}
							onChange={this.valueChange.bind(this, 'desc')} />
					</Form.Item>

					<Form.Item label="图片地址">
						<Input
							value={this.data.uri}
							onChange={this.valueChange.bind(this, 'uri')} />
					</Form.Item>

					<Form.Item label="跳转链接">
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

					<Form.Item label="">
						<Button type="primary" size="large" onClick={this.submit}>提交</Button>
						<Button size="large" onClick={this.props.history.goBack}>取消</Button>
					</Form.Item>
				</Form>
				
			</div>
		)
	}
}

export default ViewBannerDetail