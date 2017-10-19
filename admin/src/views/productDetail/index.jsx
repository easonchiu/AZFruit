import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'

import { Button, Form, Input, InputNumber, Switch, Loading, Message, Select, Toast } from 'element-react'
import Colors from 'src/components/colors'

@connect
@reactStateData
class ViewProductDetail extends Component {
	constructor(props) {
		super(props)

		this.setData({
			id: '',
			loading: true,

			name: '',
			index: 0,
			desc: '',
			isImport: false,
			origin: '',
			classes: [],
			classNames: [],
			badge: '',
			badgeColor: '',
			imgs: [],
			detail: '',
			atIndex: false,
			online: false,
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
			const res = await this.props.$product.fetchDetail({
				id
			})
			this.data.id = id
			this.data.name = res.name
			this.data.index = res.index
			this.data.desc = res.desc
			this.data.isImport = res.isImport
			this.data.origin = res.origin
			this.data.classes = res.classes
			this.data.badge = res.badge
			this.data.badgeColor = res.badgeColor
			this.data.imgs = res.imgs
			this.data.detail = res.detail
			this.data.atIndex = res.atIndex
			this.data.online = res.online
			this.data.classNames = res.classes.map(res => res.id)

			await this.props.$category.fetchOnlineList()
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
				name: this.data.name,
				index: this.data.index,
				desc: this.data.desc,
				isImport: this.data.isImport,
				origin: this.data.origin,
				classes: this.data.classes,
				badge: this.data.badge,
				badgeColor: this.data.badgeColor,
				imgs: this.data.imgs,
				detail: this.data.detail,
				atIndex: this.data.atIndex,
				online: this.data.online,
			}
			if (this.data.id) {
				await this.props.$product.update({
					id: this.data.id,
					...data
				})
			} else {
				await this.props.$product.create(data)
			}
			this.props.history.goBack()
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	changeClass = e => {
		const onlineList = this.props.$$category.onlineList

		const res = e.map(res => {
			for (let i = 0; i < onlineList.length; i++) {
				if (onlineList[i].id == res) {
					return onlineList[i]
				}
			}
		})

		this.data.classes = res
	}

	render() {
		const data = this.data

		const onlineList = this.props.$$category.onlineList

		return (
			<div className="view-productDetail">

				<h1>产品管理</h1>
				<Loading loading={this.data.loading}>
				
				<Form labelWidth={120}>
					<Form.Item label="排序">
						<InputNumber
							defaultValue={this.data.index}
							value={this.data.index}
							onChange={this.valueChange.bind(this, 'index')} />
					</Form.Item>

					<Form.Item label="产品名称">
						<Input
							value={this.data.name}
							onChange={this.valueChange.bind(this, 'name')} />
					</Form.Item>

					<Form.Item label="产品描述">
						<Input
							value={this.data.desc}
							onChange={this.valueChange.bind(this, 'desc')} />
					</Form.Item>

					<Form.Item label="是否进口">
						<Switch
							value={this.data.isImport}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'isImport')} />
					</Form.Item>

					<Form.Item label="产地">
						<Input
							value={this.data.origin}
							onChange={this.valueChange.bind(this, 'origin')} />
					</Form.Item>

					<Form.Item label="所属分类">
						<Select className="classSelect"
							value={this.data.classNames}
							onChange={this.changeClass}
							multiple={true}>
						{
							onlineList.map(res => {
								return (
									<Select.Option key={res.id} label={res.name} value={res.id} />
								)
							})
						}
						</Select>
					</Form.Item>

					<Form.Item label="标签文字">
						<Input
							value={this.data.badge}
							onChange={this.valueChange.bind(this, 'badge')} />
					</Form.Item>

					<Form.Item label="标签文字底色">
						<Colors
							value={this.data.badgeColor}
							onChange={this.valueChange.bind(this, 'badgeColor')} />
					</Form.Item>

					<Form.Item label="产品轮播图">
						imgs array
					</Form.Item>

					<Form.Item label="详情">
						<Input
							value={this.data.detail}
							onChange={this.valueChange.bind(this, 'detail')} />
					</Form.Item>

					<Form.Item label="是否首页推荐">
						<Switch
							value={this.data.atIndex}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'atIndex')} />
					</Form.Item>

					<Form.Item label="上下架">
						<Switch
							value={this.data.online}
							onText=""
							offText=""
							onColor="#13ce66"
							offColor="#ff4949"
							onChange={this.valueChange.bind(this, 'online')} />
						<em>设置为下架后，所有规格均下架</em>
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

export default ViewProductDetail