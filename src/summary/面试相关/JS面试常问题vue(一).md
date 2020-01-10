双向绑定和单向数据流，Vue里面是怎么做的？
--------------
- Vue是单向数据流，不是双向绑定；

- 双向绑定是语法糖.sync和v-model；

	v-model原理：

			通过v-bind绑定响应式数据， 

			通过v-on触发input事件并传递数据。

			.lazy 取代input监听change事件

	
	v-model 在不同的 HTML 标签上使用会监控不同的属性和抛出不同的事件：

		1. text 和 textarea 元素使用 value 属性和 input 事件；
		
		2. checkbox 和 radio 使用 checked 属性和 change 事件；
		
		3. select 字段将 value 作为 prop 并将 change 作为事件。

- Vue2.0利用Object.defineProperty用来做响应式更新；Vue3.0用Proxy做试图更新；



Vue中不同层级的组件共享数据有哪些方案？
-----
1. 父子组件常用方案：   prop与$emit  和 .sync/v-model

2. 爷孙组件（多层嵌套）：  $attr/$listener  和   provider/inject

3. 兄弟组件：   Event Bus

Vue中你如何实现图片懒加载？
----



Vue中首屏优化有哪些方案？
-----



