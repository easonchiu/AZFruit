import './style'
import React from 'react'

import { Radio } from 'element-react'

const Colors = props => {
	const colors = [
		'#13ce66',
		'#ff4949',
		'#20a0ff',
		'#ff9900',
	]

	return (
		<Radio.Group
			className="colors-radio"
			value={props.value}
			onChange={props.onChange}>
			{
				colors.map(res => (
					<Radio key={res} value={res}><i style={{background:res}}></i></Radio>
				))
			}
		</Radio.Group>
	)
}

export default Colors