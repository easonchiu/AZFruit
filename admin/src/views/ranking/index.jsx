import './style'
import React, { Component } from 'react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'
import qs from 'qs'

import CDN from 'src/assets/libs/cdn'
import { Link } from 'react-router-dom'
import { Button, Table, Loading, Dialog, InputNumber, Message } from 'element-react'

@connect
@reactStateData
class ViewRanking extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			popupVisible: false,
			activeRanking: 9999,
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
			await this.props.$goods.fetchRanking()
		} catch(e) {
			console.error(e)
			Message.error(e.msg)
		}
		this.data.loading = false
	}

	edit = e => {
		const ranking = e.ranking ? e.ranking : 9999
		this.setState({
			popupVisible: true,
			activeRanking: ranking,
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
			await this.props.$goods.updateRanking({
				id: this.data.activeId,
				ranking: this.data.activeRanking,
			})
			await this.props.$goods.fetchRanking()
		}
		catch (e) {
			console.error(e)
			Message.error(e.msg)
		}
		this.setState({
			loading: false,
			activeRanking: 9999,
			activeId: 0
		})
	}

	render() {
		return (
			<div className="view-ranking">

				<h1>首页排行榜管理</h1>

				<h6>用户端仅显示前10名</h6>

				<Loading loading={this.data.loading}>
				<Table
					className="table"
					columns={[
						{
							label: '名次',
							prop: 'index',
							width: 100,
							align: 'center'
						}, {
							label: '排名权重',
							prop: 'ranking',
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
					data={this.props.$$goods.ranking}
					border={true}
				/>
				</Loading>

				<Dialog
					title="修改商品排名权重"
					visible={this.data.popupVisible}
					className="ranking-box"
					onCancel={e => this.data.popupVisible = false}>
					<Dialog.Body>
						<p>权重（越大越靠前）</p>
						<InputNumber
							min="0"
							max="9999"
							value={this.data.activeRanking}
							onChange={e => this.data.activeRanking = e}
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

export default ViewRanking