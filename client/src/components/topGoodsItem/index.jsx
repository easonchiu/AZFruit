import './style'
import React from 'react'
import cn from 'classnames'
import CDN from 'src/assets/libs/cdn'
import { Link } from 'react-router-dom'

const TopGoodsItem = props => {
	const data = props.source || {}
	const top = props.top + 1

	return (
		<Link to={`/detail/${data.id}`} className={cn('top-goods-item', props.className)}>
			{
				top == 1 ?
				<sup className="top-goods-item__no-1" /> :
				top == 2 ?
				<sup className="top-goods-item__no-2" /> :
				top == 3 ?
				<sup className="top-goods-item__no-3" /> :
				null
			}
			<div className="thumb">
				<img src={CDN+data.cover} />
			</div>
			<div className="info">
				{
					data.origin && data.isImport ?
					<span className="import"><i />{data.origin}</span> :
					null
				}
				<h1>
					{data.name}
					{
						data.badge ?
						<span className="badge">
							<em style={{backgroundColor:data.badgeColor}}>{data.badge}</em>
						</span> :
						null
					}
				</h1>
				{
					data.desc ?
					<p>{data.desc}</p> :
					null
				}
				<h6 className="price">
					<span>￥</span>
					<em>{data.price / 100}</em>
					<span>元/{data.unit}</span>
				</h6>
				{
					data.prePrice > data.price ?
					<del>原价 {data.prePrice / 100}元</del> :
					null
				}
			</div>
		</Link>
	)
}

export default TopGoodsItem