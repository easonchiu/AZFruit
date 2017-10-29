import CSSModules from 'react-css-modules'

export default styles => Component => CSSModules(Component, styles, {
	allowMultiple: true
})