### 核心

`webpack` 的核心有四个
- entry 入口
- output 输出
- loader 
- plugin 插件

**entry**
> 指示 `webpack` 应该使用哪个模块，来作为构建其内部 依赖图(dependency graph) 的开始。进入入口起点后，`webpack` 会找出有哪些模块和库是入口起点（直接和间接）依赖的.默认值是 `./src/index.js`

**output**
> 告诉 `webpack` 在哪里输出它所创建的 `bundle`，以及如何命名这些文件。主要输出文件的默认值是 `./dist/main.js`，其他生成文件默认放置在 `./dist` 文件夹中

**loader**
> `webpack` 只能理解 `JavaScript` 和 `JSON` 文件。`loader` 让 `webpack` 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中

**plugin**
> `loader` 用于转换某些类型的模块，而插件则可以用于执行范围更广的任务。包括：打包优化，资源管理，注入环境变量

##### 常用的plugin
**一、功能类**

- html-webpack-plugin --- html文件生成插件
- copy-webpack-plugin --- 文件复制插件
- clean-webpack-plugin --- 清空文件夹插件
- progress-bar-webpack-plugin --- 编译进度条插件

**代码相关类**

- webpack.DefinePlugin --- 再打包阶段定义全局变量插件
- webpack.ProvidePlugin --- 提供库，自动加载模块
- mini-css-extract-plugin （生产模式）--- css提取插件

**三、编译结果优化类**

- purifycss-webpack --- css 去除无用的样式
- optimization.splitChunks --- 公共代码抽取插件
- uglifyjs-webpack-plugin --- 代码丑化，用于js压缩
- optimize-css-assets-webpack-plugin --- css压缩，主要使用 [cssnano 压缩器]( https://github.com/cssnano/cssnano)
- SplitChunksPlugin --- 用于chunk切割。
- - imagemin-webpack-plugin --- 图片压缩插件

**四、编译优化类**

- DllPlugin && DllReferencePlugin && autodll-webpack-plugin --- dllPlugin将模块预先编译
> dllPlugin将模块预先编译，DllReferencePlugin 将预先编译好的模块关联到当前编译中，当 webpack 解析到这些模块时，会直接使用预先编译好的模块。

- happypack && thread-loader --- 多线程编译，加快编译速度，thread-loader不可以和 mini-css-extract-plugin 结合使用
- hard-source-webpack-plugin && cache-loader --- 使用模块编译缓存，加快编译速度
- webpack.HashedModuleldsPlugin --- 保持moudle.id稳定
- webpack.NoEmitOnErrorsPlugin --- 屏蔽错误

**五、编译分析类**

- webpack-bundle-analyzer --- 编译模块分析插件
- speed-measure-webpack-plugin --- 统计编译过程中，各loader和plugin使用的时间



### 简单的webpack.dll.js配置用例

	const output = {
	  filename: '[name].dll.js',
	  library: '[name]_library',
	  path: __dirname + '/vendor/'
	}
	
	module.exports = {
	  entry: {
	    vendor: ['react', 'react-dom']  // 我们需要事先编译的模块，用entry表示
	  },
	  output: output,
	  plugins: [
	    new webpack.DllPlugin({  // 使用dllPlugin
	      path: path.join(output.path, `${output.filename}.json`),
	      name: output.library // 全局变量名， 也就是 window 下 的 [output.library]
	    })
	  ]
	}

### 简单的webpack配置用例


	const path = require('path')
	const webpack = require('webpack')
	const HtmlWebpackPlugin = require('html-webpack-plugin')
	const happPack = require('happypack')
	const os = require('os')
	const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
	
	module.exports = {
		entry: path.resolve(__dirname, './app.js'),
		output: {
			path: path.resolve(__dirname, './dist/'),
			filename: '[name].bundle.[hash].js'
		},
		devServer: {
			port: '3000',
			// 是否打开浏览器
			open: true,
			hot: true
		},
		module: {
			rules: [
				{test: /\.js$/, use: "happPack?loader='babel-loader'"}, // .babelrc @babel/preset-env
				{test: /\.css$/, use:['style-loader','css-loader']},
				{test:/\.(scss|sass)$/, use:['style-loader','css-loader','sass-loader']},
				{test:/\.(png|jpg|jpeg|gif|bmp)$/,use:[
					{
						loader:'url-loader',
						options: {
				          name: '[name].[ext]',
				          outputPath: 'images/',
				          limit: 8192,
				        },
					}
				],
				{test: /\.(svg|eot|tff|woff2?)$/, use: [
					loader: 'file-loader',
					options: {
			          name: '[name]_[hash:7].[ext]',
			          outputPath: 'fonts/',
			          limit: 8192,
			        },
				]}
			]
		},
		plugins:[
			new webpack.DefinePlugin({
				"test": {a: 1}
			}),
			new webpack.ProvidePlugin({
				$: 'jquery'
			}),
			new webpack.DllReferencePlugin({
				manifest: require('./vendor/vendor.dll.js.json'), // 引进dllPlugin编译的json文件
      			name: 'vendor.dll.js' // 全局变量名，与dllPlugin声明的一致
			}),
			new happPack({
				id: 'babel-loader',
			    threadPool: happyThreadPool,
			    loaders: ['babel-loader']
			})
		]
	}
