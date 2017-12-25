import axios from 'axios'
import { getToken, setToken, clearToken} from './token'

const config = {
	production: '/server/app',
	develop: 'proxy',
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
	const token = getToken('token')
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
		window.location.href = process.env.ENV_NAME === 'production' ? '/login' : '/#/login'
		return Promise.reject({
			msg: '登录超时，请重新登录'
		})
	}
	return Promise.reject({
		msg: '系统错误'
	})
})

export default http