module.exports = {
    publicPath: './',
    productionSourceMap: false,
    devServer: {
		port: "8088",
		open: false,
        proxy: {
			/* '/api': {
				target: 'http://172.30.41.57:85',
				changeOrigin: true,
				pathRewrite: {
					'^/api': '/serve/inter'
				}
			} */
			// easy-mock账号x63775714
            '/easymock':{
                target: 'https://www.easy-mock.com/mock/5d00d4625a16a17c32bfc699',
                changeOrigin: true,
				secure: false,
				pathRewrite: {
					'^/easymock': ''
				}
            }
        }
    },
	configureWebpack: {
	    // 关闭 webpack 的性能提示
	    performance: {
		    hints:false
	    }
		/**,
	    // 警告 webpack 的性能提示
	    performance: {
	    	hints:'warning',
	    	//入口起点的最大体积,整数类型（以字节为单位）
	    	maxEntrypointSize: 5000000,
	    	//生成文件的最大体积,整数类型（以字节为单位）
	    	maxAssetSize: 3000000,
	    	//只给出 js / css 文件的性能提示
	    	assetFilter: function(assetFilename) {
				// 提供资源文件名的断言函数
	    		return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
			}
		}**/
	}
}