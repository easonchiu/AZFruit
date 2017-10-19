import './style'
import React, {Component} from 'react'
import { Button, Dialog } from 'element-react'
import connect from 'src/redux/connect'
import reactStateData from 'react-state-data'
import cn from 'classnames'

import CDN from 'src/assets/libs/cdn'

@connect
@reactStateData
class Upload extends Component {
	constructor(props) {
		super(props)

		this.setData({
			loading: false,
			visible: false,
			visibleUpload: false,
			value: ''
		})
	}

	// 存base64
	async uploadBase64(base64) {
		try {
			if (base64) {
				const res = await this.props.$upload.upload({
					base64,
					class: this.props.classes
				})
				this.props.onChange(res)
			} else {
				Message.error('获取base64失败')
			}
		} catch(e) {
			Message.error(e.msg)
		}
	}
	
	// 获取base64
	renderBase64(src){
		// 参数，最大宽度
		var MAX_W = this.props.maxWidth || 100
		// 创建一个 Image 对象
		var image = new Image()
		// 绑定 load 事件处理器，加载完成后执行
		image.onload = e => {
			// 获取 canvas DOM 对象
			var canvas = document.createElement("canvas")
			// 如果高度超标
			if(image.width > MAX_W) {
				// 宽度等比例缩放 *=
				image.height *= MAX_W / image.width
				image.width = MAX_W
			}
			// 获取 canvas的 2d 环境对象,
			// 可以理解Context是管理员，canvas是房子
			var ctx = canvas.getContext("2d")
			// canvas清屏
			ctx.clearRect(0, 0, canvas.width, canvas.height)
			// 重置canvas宽高
			canvas.width = image.width
			canvas.height = image.height
			// 将图像绘制到canvas上
			ctx.drawImage(image, 0, 0, image.width, image.height)
			
			// 获取base64
			var imgData = canvas.toDataURL('image/jpeg')
			
			this.uploadBase64(imgData)
			canvas = null
		}
		// 设置src属性，浏览器会自动加载。
		// 记住必须先绑定事件，才能设置src属性，否则会出同步问题。
		image.src = src
	}

	// 加载 图像文件(url路径)  
	loadImage(src) {
	    // 过滤掉 非 image 类型的文件  
	    if(!src.type.match(/image.*/)){  
	        alert('asdf')
	        return 
	    }
	
		// 创建 FileReader 对象 并调用 render 函数来完成渲染.  
		var reader = new FileReader() 
		// 绑定load事件自动回调函数  
		reader.onload = e => {  
	        // 调用前面的 render 函数  
	        this.renderBase64(e.target.result) 
	    } 
	    // 读取文件内容  
	    reader.readAsDataURL(src) 
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
				class: this.props.classes,
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

	uploadInputChange = e => {
		this.loadImage(e.target.files[0])
	}

	render() {
		return (
			<div className="img-upload">
				<div className="box" style={{backgroundImage: `url(${CDN+this.props.value})`}}>
					{
						!this.props.value ?
						'无图片' :
						null
					}
				</div>
				<div className="upload el-upload el-upload--text">
					<Button type="primary" onClick={e => {
						this.refs.uploadInput.click()
					}}>上传新图</Button>
					<input
						ref="uploadInput"
						type="file"
						value={this.data.value}
						accept=".jpg,.jpeg,.png"
						onChange={this.uploadInputChange} />
				</div>
				
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
									<div className="in" style={{backgroundImage: `url(${CDN+res.uri})`}}>
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