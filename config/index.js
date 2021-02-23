'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {

    // Paths
    assetsSubDirectory: 'static',
//  assetsPublicPath: './',
    assetsPublicPath: '/',
    proxyTable: { //http://localhost:8080/
    	 '/': {  //使用"/api"来代替"http://f.apiplus.c"
// target: 'http://192.168.0.143:8088', //源地址 y
//      target: 'http://123.206.221.73:8088', //源地址 y
//       target: 'http://192.168.0.136:8088', //源地址 w
// target: 'http://127.0.0.1:8088',
         target: 'http://test.payq-iot.com:7002',//源地址 j
//    target: 'http://192.168.0.196:8088',
// target: 'https://sys.payq-iot.com:8089',
// target: 'http://192.168.0.142:8088',
//	 target: 'https://source.payq-iot.com:8089',
	changeOrigin: true, //改变源
//	pathRewrite: {
//		'^/api': '' //路径重写
//	}
  }
    },

    // Various Dev Server settings
//  192.168.0.193
    host: '192.168.0.193', // can be overwritten by process.env.HOST
    port: 8083, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-


    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false ,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
