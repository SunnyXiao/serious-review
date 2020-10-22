<!--
 * @Author: your name
 * @Date: 2020-05-29 17:26:37
 * @LastEditTime: 2020-05-29 18:12:56
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \serious-review\src\summary\webpack\webpack一些原理知识.md
 -->

### webpack 打包原理

- 根据webpack的配置文件，找到入口文件；
- 解析入后文件，找出所有依赖模块；
- 递归解析所有依赖项,生成依赖关系图；
- 重写 require 函数,输出 bundle；


### webpack 文件监听原理
原理： 轮询判断文件的最后编辑时间是否变化，如果某个文件发生了变化，并不会立刻告诉监听者，而是先缓存起来，等 aggregateTimeout 后再执行。


### 如何优化webpack构建速度

- 使用高版本的webpack和nodejs
- 多进程 ： thread-loader
- 压缩代码： 
    多进程并行压缩：
        uglifyjs-webpack-plugin压缩js；

        通过 mini-css-extract-plugin 提取 Chunk 中的 CSS 代码到单独文件，通过 css-loader 的 minimize 选项开启 cssnano 压缩 CSS。
- 图片压缩
    使用基于 Node 库的 imagemin (很多定制选项、可以处理多种图片格式)
    
    配置 image-webpack-loader

- 缩小打包作用域
    exclude/include (确定 loader 规则范围)
    
    resolve.modules 指明第三方模块的绝对路径 (减少不必要的查找)
    
    resolve.mainFields 只采用 main 字段作为入口文件描述字段 (减少搜索步骤，需要考虑到所有运行时依赖的第三方模块的入口文件描述字段)
    
    resolve.extensions 尽可能减少后缀尝试的可能性noParse 对完全不需要解析的库进行忽略 (不去解析但仍会打包到 bundle 中，注意被忽略掉的文件里不应该包含 import、require、define 等模块化语句)
    
    IgnorePlugin (完全排除模块)
    
    合理使用alias

- 提取页面公共资源

    使用 html-webpack-externals-plugin，将基础包通过 CDN 引入，不打入 bundle 中；
    
    使用 SplitChunksPlugin 进行(公共脚本、基础包、页面公共文件)分离(Webpack4内置) ，替代了 CommonsChunkPlugin 插件；

- Tree shaking
