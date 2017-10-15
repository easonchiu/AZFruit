import './style'
import React, {Component} from 'react'
import { Button, Dialog } from 'element-react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'

@connect
@reactStateData
class Upload extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			visible: false,
			visibleUpload: false
		})
	}

	fromKu = e => {
		this.data.visible = true
		this.fetch()
	}

	async fetch(skip = 0) {
		this.data.loading = true
		try {
			this.skip = skip
			await this.props.$upload.fetchList({
				skip,
				limit: 999
			})
		} catch(e) {
			console.error(e)
		}
		this.data.loading = false
	}

	imgClick = e => {
		this.props.onChange(e)
		this.data.visible = false
	}

	render() {
		return (
			<div className="img-upload">
				<div className="box">
					{this.props.value}
				</div>
				<Button type="primary" onClick={e => this.data.visibleUpload = true}>上传新图</Button>
				<Button type="success" onClick={this.fromKu}>从图片库选择</Button>

				<Dialog
					className="imageku"
					title="图片库"
					size="large"
					visible={this.data.visible}
					onCancel={e => this.data.visible = false}>
					<Dialog.Body>
					{
						this.props.$$upload.list.map(res => {
							const css = cn('item', {
								'active': res.uri == this.props.value
							})
							return (
								<a href="javascript:;"
									onClick={this.imgClick.bind(this, res.uri)}
									key={res.name}
									className={css}>
									<div className="in">
										{res.uri}
										<img src={res.uri} />
										<h6>分类：{res.class}</h6>
									</div>
								</a>
							)
						})
					}
					</Dialog.Body>
				</Dialog>

				<Dialog
					className="imageupload"
					title="图片上传"
					size="small"
					visible={this.data.visibleUpload}
					onCancel={e => this.data.visibleUpload = false}>
					<Dialog.Body>
						upload 插件
					</Dialog.Body>
					<Dialog.Footer>
						<Button type="primary">上传</Button>
						<Button onClick={e => this.data.visibleUpload = false}>取消</Button>
					</Dialog.Footer>
				</Dialog>
			</div>
		)
	}
}

export default Upload