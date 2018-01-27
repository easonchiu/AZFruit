import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import CDN from 'src/assets/libs/cdn'
import { Link } from 'react-router-dom'
import { Button, Table, Loading, Dialog, InputNumber, Message, Switch } from 'element-react'

@connect
@reactStateData
class ViewRecom extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			popupVisible: false,
			activeRecom: 9999,
			activeId: 0
		})
	}

	shouldComponentUpdate(nProps, nState) {
		return this.props !== nProps || this.state !== nState
	}

	componentDidMount() {
		this.fetch()
	}

	async fetch() {
		this.data.loading = true
		try {
			await this.props.$goods.fetchRecom()
		} catch(e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.data.loading = false
	}

	edit = e => {
		const recom = e.recom != undefined ? e.recom : 9999
		console.log(recom)
		this.setState({
			popupVisible: true,
			activeRecom: recom,
			activeId: e.id
		})
	}

	editSubmit = async e => {
		if (this.data.activeId === 0) {
			return false
		}
		this.setState({
			loading: true,
			popupVisible: false
		})
		try {
			await this.props.$goods.updateRecom({
				id: this.data.activeId,
				recom: this.data.activeRecom,
			})
			await this.props.$goods.fetchRecom()
		}
		catch (e) {
			Message.error(e.msg)
			console.error(e)
		}
		this.setState({
			loading: false,
			activeRecom: 9999,
			activeId: 0
		})
	}

	render() {
		return (
			<div className="view-recom">

				<h1>首页推荐管理</h1>

				<h6>用户端仅显示前10名</h6>

				<Loading loading={this.data.loading}>
				<Table
					className="table"
					columns={[
						{
							label: '排序',
							prop: 'index',
							width: 100,
							align: 'center'
						}, {
							label: '推荐权重',
							prop: 'recom',
							width: 100,
							align: 'center'
						}, {
							label: '名称',
							prop: 'name',
							width: 300
						}, {
							label: '产品图',
							render: data => {
								return <img src={CDN+data.cover} />
							}
						}, {
							label: '',
							width: 150,
							render: data => {
								if (typeof data != 'object') {
									return null
								}
								return (
									<p className="console">
										<a
											href="javascript:;"
											onClick={this.edit.bind(this, data)}
										>
											修改
										</a>
									</p>
								)
							}
						}
					]}
					rowClassName={e => e.index < 11 ? 'online' : 'offline'}
					data={this.props.$$goods.recom}
					border={true}
				/>
				</Loading>

				<Dialog
					title="修改商品推荐权重"
					visible={this.data.popupVisible}
					className="recom-box"
					onCancel={e => this.data.popupVisible = false}>
					<Dialog.Body>
						<p>权重（越大越靠前）</p>
						<InputNumber
							min="0"
							max="9999"
							value={this.data.activeRecom}
							onChange={e => this.data.activeRecom = e}
						/>
					</Dialog.Body>
					<Dialog.Footer>
						<Button onClick={e => this.data.popupVisible = false}>
							取消
						</Button>
						<Button type="primary" onClick={this.editSubmit}>
							确定
						</Button>
					</Dialog.Footer>
				</Dialog>

			</div>
		)
	}
}

export default ViewRecom