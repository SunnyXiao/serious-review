
[1.SAP的优缺点](#1sap的优缺点)

[2. vue 的父组件和子组件生命周期钩子函数执行顺序？](#2-vue-的父组件和子组件生命周期钩子函数执行顺序)

[3. Vue各阶段数据可使用情况：created，computed，data，prop，mounted，methods，watch](#3-vue各阶段数据可使用情况createdcomputeddatapropmountedmethodswatch)

[4. 父组件如何监听到子组件的生命周期？](#4-父组件如何监听到子组件的生命周期)

[5. 为什么vue组件中data是一个函数，然后return一个对象，而new Vue实例中，data可以是一个对象？](#5-为什么vue组件中data是一个函数然后return一个对象而new-vue实例中data可以是一个对象)

[6. vue 组件间通信有哪几种方式？](#6-vue-组件间通信有哪几种方式)

[7. vuex使用](#7-vuex使用)

[8. vue-router 路由模式有几种？](#8-vue-router-路由模式有几种)

[9. vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 ？](#9-vue-怎么用-vmset-解决对象新增属性不能响应的问题-)

[10. vue中 key的作用？](#10-vue中-key的作用)

[11. vue项目进行哪些优化？](#11-vue项目进行哪些优化)

  [1、代码层面的优化](#1代码层面的优化)

  [2、Webpack 层面的优化](#2webpack-层面的优化)

  [3、基础的 Web 技术的优化](#3基础的-web-技术的优化)

[12. vuex如何区分state是外部直接修改还是通过mutation方法修改的？](#12-vuex如何区分state是外部直接修改还是通过mutation方法修改的)

[13. vue-router 有哪几种导航钩子？](#13-vue-router-有哪几种导航钩子)

[14. vue的nextTick 与setTimeout区别？](#14-vue的nexttick-与settimeout区别)

<a id="markdown-1sap的优缺点" name="1sap的优缺点"></a>
### 1.SAP的优缺点

优点

- 用户体验好、快，内容的改变不需要重新加载整个页面，避免了不必要的跳转和重复渲染。
- 相对服务器压力小；
- 前后端分离，架构清晰；

缺点

- 首次加载耗时多；
- 前进后退路由管理，不能使用浏览器的前进后退功能，所有页面切换需要自己建立堆栈管理；


<a id="markdown-2-vue-的父组件和子组件生命周期钩子函数执行顺序" name="2-vue-的父组件和子组件生命周期钩子函数执行顺序"></a>
### 2. vue 的父组件和子组件生命周期钩子函数执行顺序？

分为4部分

* 渲染加载过程

父 beforeCreate -> 父 Create ->  父 beforeMount -> 子 beforeCreate -> 子 Create ->  子 beforeMount -> 子 mounted -> 父 mounted

* 子组件更新过程

父 beforeUpdate -> 子 beforeUpdate -> 子 updated -> 父 updated

* 父组件更新过程

父 beforeUpdate -> 父 updated

* 销毁过程

父 beforeDestory -> 子 beforeDestory -> 子 destoryed -> 父 destoryed


<a id="markdown-3-vue各阶段数据可使用情况createdcomputeddatapropmountedmethodswatch" name="3-vue各阶段数据可使用情况createdcomputeddatapropmountedmethodswatch"></a>
### 3. Vue各阶段数据可使用情况：created，computed，data，prop，mounted，methods，watch

created时，可用data和prop中的数据。

computed的属性，当在mounted或者dom中使用到时，才会属性的执行代码。

最后是mounted，可使用前面的数据，并且此时才可以操作dom。

watch不会再创建阶段自动执行，除了添加立即执行这个配置项。

加载顺序： prop -> methods -> data -> computed (加载时间是： beforeCreate 与 created之间)


<a id="markdown-4-父组件如何监听到子组件的生命周期" name="4-父组件如何监听到子组件的生命周期"></a>
### 4. 父组件如何监听到子组件的生命周期？

  // parent.vue
  <Child @hook:mountd = "doSomething"></Child>

  doSomething(){
    console.log('监听子组件mounted钩子')
  }

  // child.vue

  mounted(){
    console.log('子组件触发mounted钩子')
  }

  // 输出：
  // 子组件触发mounted钩子
  // 监听子组件mounted钩子

  @hook可以监听其他的生命周期事件，如：created、updated.....


<a id="markdown-5-为什么vue组件中data是一个函数然后return一个对象而new-vue实例中data可以是一个对象" name="5-为什么vue组件中data是一个函数然后return一个对象而new-vue实例中data可以是一个对象"></a>
### 5. 为什么vue组件中data是一个函数，然后return一个对象，而new Vue实例中，data可以是一个对象？

组件是用来复用的，如果组件中的data是一个对象，子组件中的data属性值会相互影响。


<a id="markdown-6-vue-组件间通信有哪几种方式" name="6-vue-组件间通信有哪几种方式"></a>
### 6. vue 组件间通信有哪几种方式？

* props / $emit 适用 父子组件通信
* EventBus （$emit / $on） 适用于 父子、隔代、兄弟组件通信
* $attrs/$listeners 适用于 隔代组件通信
* provide / inject 适用于 隔代组件通信
* vuex 适用于 父子、隔代、兄弟组件通信



<a id="markdown-7-vuex使用" name="7-vuex使用"></a>
### 7. vuex使用

vuex的核心就是store

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。

vuex主要包括以下几个模块

* State：应用状态的数据结构，可以在这里设置默认的初始状态。
* Getter： 与vue的computed类似，可以通过mapGetter将 store 中的 getter 映射到组件的局部计算属性。
* Mutation： 是唯一更改 store 中状态的方法，且必须是同步函数。
* Action：用于提交 mutation，而不是直接变更状态，可以包含任意异步操作。
* Module：允许将单一的 Store 拆分为多个 store 且同时保存在单一的状态树中。


<a id="markdown-8-vue-router-路由模式有几种" name="8-vue-router-路由模式有几种"></a>
### 8. vue-router 路由模式有几种？

3种： hash、history、abstract

* hash:  使用 URL hash 值来作路由。支持所有浏览器，包括不支持 HTML5 History Api 的浏览器；

* history :  依赖 HTML5 History API 和服务器配置。具体可以查看 HTML5 History 模式；

* abstract :  支持所有 JavaScript 运行环境，如 Node.js 服务器端。如果发现没有浏览器的 API，路由会自动强制进入这个模式.

<a id="markdown-9-vue-怎么用-vmset-解决对象新增属性不能响应的问题-" name="9-vue-怎么用-vmset-解决对象新增属性不能响应的问题-"></a>
### 9. vue 怎么用 vm.$set() 解决对象新增属性不能响应的问题 ？

Vue 提供了 Vue.set (object, propertyName, value) / vm.$set (object, propertyName, value) 来实现为对象添加响应式属性，那框架本身是如何实现的呢？

看vue源码 vue/src/core/instance/index.js

vm.$set 的实现原理是：

* 数组： 通过直接使用数组的splice方法触发响应式；
* 对象： 会先判读属性是否存在、对象是否是响应式，最终如果要对属性进行响应式处理，则是通过调用 defineReactive 方法进行响应式处理


<a id="markdown-10-vue中-key的作用" name="10-vue中-key的作用"></a>
### 10. vue中 key的作用？

key是vnode的唯一标记，通过key，diff操作可以更准确、快速，因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。


<a id="markdown-11-vue项目进行哪些优化" name="11-vue项目进行哪些优化"></a>
### 11. vue项目进行哪些优化？


<a id="markdown-1代码层面的优化" name="1代码层面的优化"></a>
#### 1、代码层面的优化

* v-if 和 v-show 区分使用场景
* computed 和 watch  区分使用场景
* v-for 遍历必须为 item 添加 key，且避免同时使用 v-if
* 长列表性能优化 （如禁止vue劫持数据，可以使用Object.freeze 方法来冻结一个对象，一旦被冻结的对象就再也不能被修改了）
* 事件的销毁
* 图片资源懒加载
* 路由懒加载
* 第三方插件的按需引入
* 优化无限列表性能 （可以参考开源项目[vue-virtual-scroller](https://github.com/Akryum/vue-virtual-scroller)）
* 服务端渲染 SSR or 预渲染


<a id="markdown-2webpack-层面的优化" name="2webpack-层面的优化"></a>
#### 2、Webpack 层面的优化

* Webpack 对图片进行压缩
* 减少 ES6 转为 ES5 的冗余代码（解决方法： 安装babel-plugin-transform-runtime，在.babelrc 配置文件配置plugins）
* 提取公用代码（webpack4.x用optimization）
* 提取组件的css
* 构建结果输出分析（webpack-bundle-analyzer）
* 优化SourceMap（开发环境推荐： cheap-module-eval-source-map）


<a id="markdown-3基础的-web-技术的优化" name="3基础的-web-技术的优化"></a>
#### 3、基础的 Web 技术的优化

* 开启gzip压缩
* 浏览器缓存
* CDN的使用
* 使用 Chrome Performance 查找性能瓶颈

<a id="markdown-12-vuex如何区分state是外部直接修改还是通过mutation方法修改的" name="12-vuex如何区分state是外部直接修改还是通过mutation方法修改的"></a>
### 12. vuex如何区分state是外部直接修改还是通过mutation方法修改的？

vuex修改state的唯一渠道就是执行commit('xx',payload)方法，其底层是通过执行this._withCommit(fn)设置_committing标志变量为true，然后才能修改state，修改完毕再还原_committing，所以只要 watch 一下 state，state change 时判断是否_committing 值为 true，即可判断修改的合法性。

<a id="markdown-13-vue-router-有哪几种导航钩子" name="13-vue-router-有哪几种导航钩子"></a>
### 13. vue-router 有哪几种导航钩子？

- 全局导航钩子：beforeEach()、afterEach()
- 路由独享组件：beforeEnter() 
- 组件内的钩子：beforeRouteEnter()、beforeRouteUpdate()、beforeRouteLeave()


<a id="markdown-14-vue的nextTick 与setTimeout区别？" name="14-vue的nextTick 与setTimeout区别？"></a>
### 14. vue的nextTick 与setTimeout区别？

在vue源码中实行nextTick有4中方法：
- Promise.then
- MutationObserver
- setImmediate
- setTimeout


    let timerFunc
    if (typeof Promise !== 'undefined' && isNative(Promise)) {
      const p = Promise.resolve()
      timerFunc = () => {
        p.then(flushCallbacks)
        if (isIOS) setTimeout(noop)
      }
      isUsingMicroTask = true
    } else if (!isIE && typeof MutationObserver !== 'undefined' && (
      isNative(MutationObserver) ||
      // PhantomJS and iOS 7.x
      MutationObserver.toString() === '[object MutationObserverConstructor]'
    )) {
      // Use MutationObserver where native Promise is not available,
      // e.g. PhantomJS, iOS7, Android 4.4
      // (#6466 MutationObserver is unreliable in IE11)
      let counter = 1
      const observer = new MutationObserver(flushCallbacks)
      const textNode = document.createTextNode(String(counter))
      observer.observe(textNode, {
        characterData: true
      })
      timerFunc = () => {
        counter = (counter + 1) % 2
        textNode.data = String(counter)
      }
      isUsingMicroTask = true
    }else if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
      // Fallback to setImmediate.
      // Technically it leverages the (macro) task queue,
      // but it is still a better choice than setTimeout.
      timerFunc = () => {
        setImmediate(flushCallbacks)
      }
    } else {
      // Fallback to setTimeout.
      timerFunc = () => {
        setTimeout(flushCallbacks, 0)
      }
    }