import axios from 'axios'
import { getToken, setToken, clearToken} from './token'
import Cookies from 'js-cookie'

const config = {
	production: '/server/api',
	develop: 'api',
	test1: '/server/api',
	test2: '/server/api',
	test3: '/server/api',
	test4: '/server/api',
	test5: '/server/api',
}

const baseUrl = config[process.env.ENV_NAME] || config['develop']

const http = axios.create({
	baseURL: baseUrl,
	headers: {
		'Accept': 'application/json;version=3.0;compress=false',
		'Content-Type': 'application/json;charset=utf-8'
	}
})

http.interceptors.request.use(config => {
	const token = getToken('token')
	if (token) {
		config.headers.Authorization = 'Bearer ' + token
	}

	const csrfToken = Cookies.get('csrfToken')
	if (csrfToken) {
		config.headers['x-csrf-token'] = csrfToken
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
	if (error.response.status === '401') {
		clearToken()
		window.location.href = process.env.ENV_NAME === 'production' ? '/admin/login' : '/login'
		return false
	}
	return Promise.reject({
		msg: '系统错误'
	})
})

export default http