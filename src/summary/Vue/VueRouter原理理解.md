###前端路由
> 输入url -》js解析地址 -找到对应地址的页面 -执行页面生成的js ->看到页面


### vue-router工作流程

url改变 =》 触发监听事件 =》 改变vue-router里的current变量 =》 监视current变量的监视者 =》 获取新的组件 =》 render新组件

### hash和history的使用

#### hash
- #号后的就是hash的内容
- 可以通过location.hash拿到
- 可以通过onhashchange监听hash的改变

#### history
- History即正常的路径
- location.pathname
- 可以用onpopstate监听history的变化

pushState 和 repalceState 两个 API 来操作实现 URL 的变化 ；
history.pushState() 或 history.replaceState() 不会触发 popstate 事件，这时我们需要手动触发页面跳转（渲染）。

	window.history.pushState(null, null, path);
	window.history.replaceState(null, null, path);


### vue插件编写
#### vue.use 用法
vue.use(element)

vue.use(function(){})


> 如果传入use里头的是一个方法，就会执行这个方法；
> 
> 但是无论你给他的是任何东西，只要这个有install属性，就会执行install方法

#### vue.mixin 注入组件选项
- vuejs有向外暴露工具类:vue.util,包含4个方法：defineReactive、extend、mergeOptions、warn。 根据开发插件情况可以使用

- Vue.extend 和 Vue.util.extend的区别：

Vue.util.extend： 实际是做了一个浅拷贝，与jquery.extend相同；
Vue.extend: 使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象。


### 自己开发一个简单的vue-router

    class HistoryRoute {
		constructor(){
			this.current = null;
		}
	}

	class vueRouter {
		constructor(options){
			this.mode = options.mode || 'hash';
			this.routes = options.routes || [];
			this.routesMap = this.createRouterMap(this.routes);
			this.history = new HistoryRoute;
			this.init();
		}
		init(){
			if(this.mode === 'hash){
				location.hash ? '' : location.hash='/';
				window.addEventListener('load', ()=>{
					this.history.current = location.hash.slice(1)
				})
				window.addEventListener('hashchange', ()=>{
					this.history.current = location.hash.slice(1)
				})
			}
		}
		createRouterMap(routes) {
			return routes.reduce((memo, current) => {
				memo[current.path] = current.component;
				return memo;
			},{})
		}
	}
	
	vueRouter.install(vue){
		if(vueRouter.install.installed){return}
		vueRouter.install.installed = true
		vue.mixin({
			beforeCreate(){
				// this指向当前vue实例
				if(this.$options && this.$options.router){
					this._root = this;
					this._router = this.$options.router;
					vue.util.defineReactive(this,'current',this._router.history)
				} else {
					this._root=this.$parent._root
				}
				Object.defineProperty(this, '$router",{
					get(){
						return this._root._router;
					}
				})
			}
		})
		vue.component('router-view', {
			render(h){
				let current = this._self._root_.history.current;
				let routerMap = this._self._root._router.routesMap
				return h(routerMap[current])
			}
		})
	}

	export default vueRouter;


