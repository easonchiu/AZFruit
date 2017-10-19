import axios from 'axios'

const config = {
	production: '/',
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
	return Promise.reject({
		msg: '系统错误'
	})
})

export default http