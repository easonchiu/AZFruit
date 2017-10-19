import './style'
import React from 'react'
import cn from 'classnames'

const TopGoodsItem = props => {
	return (
		<div className={cn('top-goods-item', props.className)}>
			<div className="thumb">
				<span className="import">进口</span>
				<img src="#" />
			</div>
			<div className="info">
				<h1>
					云南凤梨
					<span className="badge">特价</span>
				</h1>
				<p>8424好西瓜</p>
				<strong className="price">￥68元/2只</strong>
			</div>
		</div>
	)
}

export default TopGoodsItem