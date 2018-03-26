const path = require('path')
const config = require('../config')
const utils = require('./utils')
const webpack = require('webpack')
const merge = require('webpack-merge')

const baseWebpackConfig = require('./webpack.base.conf')


// 针对生产环境修改配置
const webpackConfig = merge(baseWebpackConfig, {

	devtool: '#cheap-module-eval-source-map',

	output: {
        path: config.develop.assetsRoot,
        filename: utils.assetsPath('js/[name].js'),
        chunkFilename: utils.assetsPath('js/[id].js'),
        publicPath: config.develop.assetsPublicPath
    },

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
	],

	devServer: {
		contentBase: __dirname,
	    historyApiFallback: true,
	    hot: true,
	    open: true,
	    inline: true,
	    disableHostCheck: true,
	    port: config.develop.port,
	    proxy: {
	    	'/proxy/*': {
	            target: 'http://localhost:7001/server/api/m',
	            // target: 'http://www.ivcsun.com/server/app',
	            pathRewrite: {
	            	'^/proxy/': '/'
	            },
	            changeOrigin: true,
	            secure: false,
	        },
	    }
	}
})

module.exports = webpackConfig