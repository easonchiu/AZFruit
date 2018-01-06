import axios from 'axios'
import { getToken, setToken, clearToken} from './token'

const config = {
	production: '/server/app',
	develop: '/proxy',
}

const baseUrl = config[process.env.ENV_NAME] || config['develop']

const http = axios.create({
	baseURL: baseUrl,
	header: {
		'Accept': 'application/json;version=3.0;compress=false',
		'Content-Type': 'application/json;charset=utf-8'
	}
})

http.interceptors.request.use(config => {
	const token = getToken()
	if (token) {
		config.headers.Authorization = 'Bearer ' + token
	}
	return config
})

http.interceptors.response.use(config => {
	if (config.data.code === 0) {
		return config.data.data
	}
	return Promise.reject({
		msg: config.data.msg
	})
}, error => {
	if (error.response.status == '401') {
		clearToken()
		const token = getToken()
		if (!token) {
			const redirect = encodeURIComponent(window.location.href)
			window.history.replaceState(null, '', '/login?redirect=' + redirect)
			window.location.reload()
			return
		}
		else {
			return Promise.reject({
				msg: '登录超时，请重新登录'
			})
		}
	}
	return Promise.reject({
		msg: '系统错误'
	})
})

export default http