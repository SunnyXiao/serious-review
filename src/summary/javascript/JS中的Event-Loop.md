#### 从一道题浅说 JavaScript 的事件循环

	async function async1 () {
		console.log('async1 start')
		await async2();
    	console.log('async1 end');
	}

	async function async2 () {
		console.log('async2');
	}
	
	console.log('script start');
	
	setTimeout(function(){
		console.log('setTimeout')
	});

	async1()

	new Promise(function(resolve) {
	    console.log('promise1');
	    resolve();
	}).then(function() {
	    console.log('promise2');
	});
	console.log('script end');

	// 输出结果：
	/*
	script start
	async1 start
	async2
	promise1
	script end
	async1 end
	promise2
	setTimeout
	*/
这道题主要考察的是事件循环中函数执行顺序的问题，其中包括async ，await，setTimeout，Promise函数。分析如下：

宏任务
----------
(macro)task（又称之为宏任务），可以理解是每次执行栈执行的代码就是一个宏任务（包括每次从事件队列中获取一个事件回调并放到执行栈中执行）。

浏览器为了能够使得JS内部(macro)task与DOM任务能够有序的执行，会在一个(macro)task执行结束后，在下一个(macro)task 执行开始前，对页面进行重新渲染，流程如下：

	(macro)task->渲染->(macro)task->...

(macro)task主要包含：script(整体代码)、setTimeout、setInterval、I/O、UI交互事件、postMessage、MessageChannel、setImmediate(Node.js 环境


微任务
----------

microtask（又称为微任务），可以理解是在当前 task 执行结束后立即执行的任务。也就是说，在当前task任务后，下一个task之前，在渲染之前。

所以它的响应速度相比setTimeout（setTimeout是task）会更快，因为无需等渲染。也就是说，在某一个macrotask执行完后，就会将在它执行期间产生的所有microtask都执行完毕（在渲染前）。

microtask主要包含：Promise.then、MutaionObserver、process.nextTick(Node.js 环境)


运行机制
---------

在事件循环中，每进行一次循环操作称为tick，每一次tick的任务处理模型是比较复杂的，但是关键步骤如下：

- 执行一个宏任务
- 执行过程中如果遇到微任务，就将它添加到微任务的任务队列中
- 宏任务执行完毕后，立即执行当前微任务队列中的所有微任务（依次执行）
- 当前宏任务执行完毕，开始检查渲染，然后GUI线程接管渲染
- 渲染完毕后，JS线程继续接管，开始下一个宏任务（从事件队列中获取）


Promise和async中的立即执行
--------------------------
我们知道Promise中的异步体现在then和catch中，所以写在Promise中的代码是被当做同步任务立即执行的。而在async/await中，在出现await出现之前，其中的代码也是立即执行的。那么出现了await时候发生了什么呢？


await做了什么
-----------------
从字面意思上看await就是等待，await 等待的是一个表达式，这个表达式的返回值可以是一个promise对象也可以是其他值。

很多人以为await会一直等待之后的表达式执行完之后才会继续执行后面的代码，实际上await是一个让出线程的标志。await后面的表达式会先执行一遍，将await后面的代码加入到microtask中，然后就会跳出整个async函数来执行后面的代码。

由于因为async await 本身就是promise+generator的语法糖。所以await后面的代码是microtask。所以对于本题中的


	async function async1() {
		console.log('async1 start');
		await async2();
		console.log('async1 end');
	}

等价于

	async function async1() {
		console.log('async1 start');
		Promise.resolve(async2()).then(() => {
	                console.log('async1 end');
	        })
	}

回到本题
------------
回到这道题来一步一步看看怎么回事儿。

1. 首先，事件循环从宏任务(macrotask)队列开始，这个时候，宏任务队列中，只有一个script(整体代码)任务；当遇到任务源(task source)时，则会先分发任务到对应的任务队列中去。

2. 然后我们看到首先定义了两个async函数，接着往下看，然后遇到了 console 语句，直接输出 script start。输出之后，script 任务继续往下执行，遇到 setTimeout，其作为一个宏任务源，则会先将其任务分发到对应的队列中.

3. script 任务继续往下执行，执行了async1()函数，前面讲过async函数中在await之前的代码是立即执行的，所以会立即输出async1 start。

遇到了await时，会将await后面的表达式执行一遍，所以就紧接着输出async2，然后将await后面的代码也就是console.log('async1 end')加入到microtask中的Promise队列中，接着跳出async1函数来执行后面的代码。

4. script任务继续往下执行，遇到Promise实例。由于Promise中的函数是立即执行的，而后续的 .then 则会被分发到 microtask 的 Promise 队列中去。所以会先输出 promise1，然后执行 resolve，将 promise2 分配到对应队列。

5. script任务继续往下执行，最后只有一句输出了 script end，至此，全局任务就执行完毕了。

根据上述，每次执行完一个宏任务之后，会去检查是否存在 Microtasks；如果有，则执行 Microtasks 直至清空 Microtask Queue。

因而在script任务执行完毕之后，开始查找清空微任务队列。此时，微任务中， Promise 队列有的两个任务async1 end和promise2，因此按先后顺序输出 async1 end，promise2。当所有的 Microtasks 执行完毕之后，表示第一轮的循环就结束了。

6. 第二轮循环开始，这个时候就会跳回async1函数中执行后面的代码，然后遇到了同步任务 console 语句，直接输出 async1 end。这样第二轮的循环就结束了。（也可以理解为被加入到script任务队列中，所以会先与setTimeout队列执行）

7. 第二轮循环依旧从宏任务队列开始。此时宏任务中只有一个 setTimeout，取出直接输出即可，至此整个流程结束。


变式一
------

在第一个变式中我将async2中的函数也变成了Promise函数，代码如下：

	async function async1() {
	    console.log('async1 start');
	    await async2();
	    console.log('async1 end');
	}
	async function async2() {
	    //async2做出如下更改：
	    new Promise(function(resolve) {
	    console.log('promise1');
	    resolve();
	}).then(function() {
	    console.log('promise2');
	    });
	}
	console.log('script start');
	
	setTimeout(function() {
	    console.log('setTimeout');
	}, 0)
	async1();
	
	new Promise(function(resolve) {
	    console.log('promise3');
	    resolve();
	}).then(function() {
	    console.log('promise4');
	});
	
	console.log('script end');


结果：

	script start
	
	async1 start
	
	promise1
	
	promise3
	
	script end
	
	promise2
	
	async1 end
	
	promise4
	
	setTimeout