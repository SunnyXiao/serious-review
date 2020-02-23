<!--
 * @Author: your name
 * @Date: 2020-02-14 23:15:01
 * @LastEditTime: 2020-02-21 17:09:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /serious-review/src/summary/Vue/vue-diff-virtual-dom.md
 -->
待续.........
## virtual DOM和真实DOM的区别？
virtual DOM是将真实的DOM的数据抽取出来，以对象的形式模拟树形结构。比如dom是这样的：

	<div>
	    <p>123</p>
	</div>

对应的virtual DOM（伪代码）：

	var Vnode = {
	    tag: 'div',
	    children: [
	        { tag: 'p', text: '123' }
	    ]
	};


Vue通过数据绑定来修改视图，当某个数据被修改的时候，set方法会让闭包中的Dep调用notify通知所有订阅者Watcher，Watcher通过get方法执行vm._update(vm._render(), hydrating)。

