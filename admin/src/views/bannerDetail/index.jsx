import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Message, Loading } from 'element-react'
import Upload from 'src/components/upload'

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
			desc: '',
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
				desc: this.data.desc,
			}
			if (this.data.id) {
				const res = await this.props.$banner.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$banner.create(data)
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
			<div className="view-bannerDetail">

				<h1>Banner管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>

					<Form.Item label="排序">
						<InputNumber
							defaultValue={this.data.index}
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
					</Form.Item>

					<Form.Item label="描述">
						<Input
							value={this.data.desc}
							onChange={this.valueChange.bind(this, 'desc')} />
					</Form.Item>

					<Form.Item label="图片">
						<Upload
							maxWidth={300}
							classes="banner"
							value={this.data.uri}
							onChange={this.valueChange.bind(this, 'uri')} />
					</Form.Item>

					<Form.Item label="跳转链接">
						<Input
							value={this.data.link}
							placeholder="为空则不跳转"
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

export default ViewBannerDetail