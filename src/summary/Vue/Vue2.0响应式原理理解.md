[实现MVVM都要掌握哪些](#实现mvvm都要掌握哪些) 

[Vue的组件为什么必须是函数，而不能直接把一个对象赋值给它](#vue的组件为什么必须是函数而不能直接把一个对象赋值给它) 

[响应式原理](#响应式原理) [MVVM构建](#mvvm构建) 

[模板编译](#模板编译) [Observer数据劫持](#observer数据劫持) 

[Watcher实现](#watcher实现) 

[Dep　发布订阅](#dep　发布订阅) 

[总结](#总结) [参考](#参考)

<a id="markdown-实现mvvm都要掌握哪些" name="实现mvvm都要掌握哪些"></a>
### 实现MVVM都要掌握哪些
- 模板编译(Compile)
- 数据劫持(Observer)
- 发布的订阅(Dep)
- 观察者(Watcher)

> MVVM模式就要将这些板块进行整合,实现模板和数据的绑定！

<a id="markdown-vue的组件为什么必须是函数而不能直接把一个对象赋值给它" name="vue的组件为什么必须是函数而不能直接把一个对象赋值给它"></a>
### Vue的组件为什么必须是函数，而不能直接把一个对象赋值给它
个人理解：

    Vue.component('my-component',{
		template: '<div>test</div>
		data(){
			return {
				name: 'dd'
			}
		}
	})


- 每个组件都是 Vue 的实例,组件可能被用来创建多个实例;
- Object是引用数据类型,如果不用function 返回,每个实例的data 都是内存的同一个地址,一个数据改变了其他也改变了


<a id="markdown-响应式原理" name="响应式原理"></a>
### 响应式原理

当你把一个普通的 JavaScript 对象传入 Vue 实例作为 data 选项，Vue 将遍历此对象所有的属性，并使用`Object.defineProperty`把这些属性全部转为 `getter/setter`.

每个组件实例都有相应的watcher实例对象，他会在组件渲染的过程中把属性记录为依赖，之后当依赖项的`setter`被调用时，会通知`watcher`重新计算，从而使他关联的组件得以更新。
![images](https://cn.vuejs.org/images/data.png)

<a id="markdown-mvvm构建" name="mvvm构建"></a>
### MVVM构建

    class MVVM {
		constructor(opts) {
			this.$el = opts.el;
			this.$data = opts.data;
			if(this.$el){
				// 数据劫持 就是把对想的所有属性 改成get和set方法
    			new Observer(this.$data);
				// 用数据和元素进行编译
				new Compile(this.$el,this)
			}
		}
    }

<a id="markdown-模板编译" name="模板编译"></a>
### 模板编译
MVVM中调用了Compile类来编译我们的页面,开始来实现模板编译

基础的架子

    class Compile {
    	constructor(el, vm) {
			this.el = this.isElementNode(el) ? el : document.querySelector(el);
			this.vm =vm;
			if(this.el){
				// 1.先把这些真实的DOM移入到内存中 fragment (性能优化)
	            let fragment = this.node2fragment(this.el);
	            // 2.编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
	            this.compile(fragment);
	            // 3.把编译号的fragment在塞回到页面里去
	            this.el.appendChild(fragment);
			}
    	}
		isElementNode(node){
			return node.nodeType === 1;
		}
		/* 核心的方法 */
	    compileElement(node) {}
	    compileText(node) {}
	    compile(fragment) {}
	    node2fragment(el) {}
    }

**node2fragment**

	node2fragment(el) { 
		// 需要将el中的内容全部放到内存中
		// 文档碎片 内存中的dom节点
		let fragment = document.createDocumentFragment();
		let firstChild;
		while (firstChild = el.firstChild) {
		fragment.appendChild(firstChild);
		// appendChild具有移动性
		}
		return fragment; // 内存中的节点
	}



**compile（在Vue中，这个步骤是交给virtualDOM完成的，这里只是简单的实现一个文本节点的编译）**

	compile(fragment) {
		// 需要递归 每次拿子元素
		let childNodes = fragment.childNodes;
		Array.from(childNodes).forEach(node => {
			if (this.isElementNode(node)) {
				// 是元素节点，还需要继续深入的检查
				// 这里需要编译元素
				this.compileElement(node);
				this.compile(node)
			} else {
				// 文本节点
				// 这里需要编译文本
				this.compileText(node);
			}
		});
	}

　

**compileElement&compileText**

    /*辅助的方法*/
	// 是不是指令
	isDirective(name) {
	    return name.includes('v-');
	}
	----------------------------
	compileElement(node) {
	    // 带v-model v-text 
	    let attrs = node.attributes; // 取出当前节点的属性
	    Array.from(attrs).forEach(attr => {
	        // 判断属性名字是不是包含v-model 
	        let attrName = attr.name;
	        if (this.isDirective(attrName)) {
	            // 取到对应的值放到节点中
	            let expr = attr.value;
	            let [, type] = attrName.split('-'); // 
	            // 调用对应的编译方法 编译哪个节点,用数据替换掉表达式
	            CompileUtil[type](node, this.vm, expr);
	        }
	    })
	}
	compileText(node) {
	    let expr = node.textContent; // 取文本中的内容
	    let reg = /\{\{([^}]+)\}\}/g; // {{a}} {{b}} {{c}}
	    if (reg.test(expr)) { 
	        // 调用编译文本的方法 编译哪个节点,用数据替换掉表达式
	        CompileUtil['text'](node, this.vm, expr);
	    }
	}


**CompileUtil**

先只处理文本和输入框的情况


	CompileUtil = {
	  text(node, vm, expr) { // 文本处理
		  let updateFn = this.updater['textUpdater'];
		  // 用处理好的节点和内容进行编译
		  updateFn && updateFn(node, value)
	  },
	  model(node, vm, expr) { // 输入框处理
		let updateFn = this.updater['modelUpdater'];
		// 用处理好的节点和内容进行编译
		updateFn && updateFn(node, value);
	  },
	  updater: {
		  // 文本更新
		  textUpdater(node, value) {
		  	node.textContent = value
		  },
		  // 输入框更新
		  modelUpdater(node, value) {
		  	node.value = value;
		  }
	  }
	}


实现text方法

	text(node, vm, expr) { // 文本处理
		let updateFn = this.updater['textUpdater'];
		// 文本比较特殊 expr可能是'{{message.a}} {{b}}'
		// 调用getTextVal方法去取到对应的结果
		let value = this.getTextVal(vm, expr);
		expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
		   new Watcher(vm, arguments[1],(newValue)=>{
		       // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
		       updateFn && updateFn(node,this.getTextVal(vm,expr));
		   });
		})
		updateFn && updateFn(node, value)
	},
	getTextVal(vm, expr) { // 获取编译文本后的结果
		return expr.replace(/\{\{([^}]+)\}\}/g, (...arguments) => {
			// 依次去去数据对应的值
			return this.getVal(vm, arguments[1]);
		})
	},
	getVal(vm, expr) { // 获取实例上对应的数据
		expr = expr.split('.'); // {{message.a}} [message,a] 实现依次取值
		// vm.$data.message => vm.$data.message.a
		return expr.reduce((prev, next) => { 
			return prev[next];
		}, vm.$data);
	}




<a id="markdown-observer数据劫持" name="observer数据劫持"></a>
### Observer数据劫持

Object.defineProperty有劫持功能咱就看看这个是怎样劫持的

    let school = {name:''}
	school.name = 'jw';  // 当我给属性设置时希望做一些操作
	console.log(school.name); // 当我获取属性时也希望对应有写操作


默认情况下定义属性给属性设置的操作是这样的

    let school = {name:''}
    school.name = 'jw';  // 当我给属性设置时希望做一些操作
    console.log(school.name); // 当我获取属性时也希望对应有写操作



这时候Object.defineProperty登场

	let school = {name:''}
	let val;
	Object.defineProperty(school, 'name', {
	  enumerable: true, // 可枚举,
	  configurable: true, // 可配置
	  get() {
		// todo
		return val;
	  },
	  set(newVal) {
		// todo
		val = newVal
	  }
	});
	school.name = 'jw';
	console.log(school.name);

这样我们可以在设置值和获取值时做我们想要做的操作了



	class Observer{
	    constructor(data){
	       this.observe(data); 
	    }
	    observe(data){ 
	        // 要对这个data数据将原有的属性改成set和get的形式
	        // defineProperty针对的是对象
	        if(!data || typeof data !== 'object'){
	            return;
	        }
	        // 要将数据 一一劫持 先获取取到data的key和value
	        Object.keys(data).forEach(key=>{
	            // 定义响应式变化
	            this.defineReactive(data,key,data[key]);
	            this.observe(data[key]);// 深度递归劫持
	        });
	    }
	    // 定义响应式
	    defineReactive(obj,key,value){
	        // 在获取某个值的适合 想弹个框
	        let that = this;
			let dep = new Dep(); // 每个变化的数据 都会对应一个数组,这个数组是存放所有更新的操作
	        Object.defineProperty(obj,key,{
	            enumerable:true,
	            configurable:true,
	            get(){ // 当取值时调用的方法
					Dep.target && dep.addSub(Dep.target);
	                return value;
	            },
	            set(newValue){ // 当给data属性中设置值的适合 更改获取的属性的值
	                if(newValue!=value){
	                    // 这里的this不是实例 
	                    that.observe(newValue);// 如果是设置的是对象继续劫持
	                    value = newValue;
						dep.notify(); // 通知所有人 数据更新了
	                }
	            }
	        });
	    }
	}



> Observer的构造方法中将会调用observe方法遍历检测每一个属性，如果该属性不是对象则返回，否则调用defineReactive方法拦截每一个属性的get, set方法，defineReactTive也新建一个依赖收集器Dep

<a id="markdown-watcher实现" name="watcher实现"></a>
### Watcher实现 ###

观察者的目的就是给需要变化的那个元素增加一个观察者，用新值和老值进行比对,如果数据变化就执行对应的方法


	class Watcher{ // 因为要获取老值 所以需要 "数据" 和 "表达式"
	    constructor(vm,expr,cb){
	        this.vm = vm;
	        this.expr = expr;
	        this.cb = cb;
	        // 先获取一下老的值 保留起来
	        this.value = this.get();
	    }
	    // 老套路获取值的方法，这里先不进行封装
	    getVal(vm, expr) { 
	        expr = expr.split('.'); 
	        return expr.reduce((prev, next) => {
	            return prev[next];
	        }, vm.$data);
	    }
	    get(){
			// 在取值前先将watcher保存到Dep上
    		Dep.target = this;
	        let value = this.getVal(this.vm,this.expr);
			Dep.target = null;
	        return value;
	    }
	    // 对外暴露的方法，如果值改变就可以调用这个方法来更新
	    update(){
	        let newValue = this.getVal(this.vm, this.expr);　// 会调用属性对应的get方法
	        let oldValue = this.value;
	        if(newValue != oldValue){
	            this.cb(newValue); // 对应watch的callback
	        }
	    }
	}



<a id="markdown-dep　发布订阅" name="dep　发布订阅"></a>
### Dep　发布订阅 ###

如何将视图和数据关联起来呢?就是将每个数据和对应的watcher关联起来。当数据变化时让对应的watcher执行update方法即可！再想想在哪做操作呢？就是我们的set和get!


	class Dep{
	    constructor(){
	        // 订阅的数组
	        this.subs = []
	    }
	    addSub(watcher){
	        this.subs.push(watcher);
	    }
	    notify(){
	        this.subs.forEach(watcher=>watcher.update());
	    }
	}


<a id="markdown-总结" name="总结"></a>
### 总结 ###

- vue就是通过以上的几个类实现了完整的MVVM模式，不同的是vue拥有更加完整的CpmpileUtil方法，针对每一个指令以及一些绑定添加特殊的updateFn方法。vue也使用了virtualDOM统一管理了对于DOM的操作；

- 纵观这个MVVM的实现，发现其核心思想还是订阅发布模式，每一个属性都有一个依赖收集器，每个使用到这个属性的DOM或者衍生属性都会向依赖收集注册一个自身的方法，当属性发生改变时，Dep将通知他们执行自身的方法，这里也是一个高度解耦的设计。而这种基于事件改变的订阅发布模式，也是整个JS无论前端后者后端的灵魂所在



<a id="markdown-参考" name="参考"></a>
### 参考
[关于MVVM的文章](https://juejin.im/post/5af8eb55f265da0b814ba766)

[Vue的原理](https://zhuanlan.zhihu.com/p/37131046)