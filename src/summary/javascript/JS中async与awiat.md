
 [async 起什么作用](#async-起什么作用)
 
  [await 到底在等啥](#await-到底在等啥)
 
  [async/await](#asyncawait)
	
	[简单的比较](#简单的比较)
 
  [async/await 的优势在于处理 then 链](#asyncawait-的优势在于处理-then-链)
<a id="markdown-async-起什么作用" name="async-起什么作用"></a>
### async 起什么作用
------

首先写段代码来试试，看看返回什么？

	async function testAsync () {
		return 'hell async'
	}
	
	const result = testAsync();
	
	console.log(result)

看到浏览器输出内容为：

	Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "hello async"}

从结果中可以看到async函数返回的是一个promise对象，如果在函数中 return 一个直接量，async 会把这个直接量通过 Promise.resolve() 封装成 Promise 对象。从[文档](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function)中也可以得到这个信息,

联想一下 Promise 的特点——无等待，所以在没有 await 的情况下执行 async 函数，它会立即执行，返回一个 Promise 对象，并且，绝不会阻塞后面的语句。这和普通返回 Promise 对象的函数并无二致。

<a id="markdown-await-到底在等啥" name="await-到底在等啥"></a>
### await 到底在等啥
--------

await 可以用于等待一个 async 函数的返回值. await 不仅仅用于等 Promise 对象，它可以等任意表达式的结果,eg:

	function getSomething() {
	    return "something";
	}


	async function test() {
	    const v1 = await getSomething();
	    console.log(v1);
	}
	
	test();


await 表达式的运算结果取决于它等的东西。

如果他等到的不是一个promise对象，那await表达式的运算结果就是它等到的东西。

如果它等到的是一个 Promise 对象，await 就忙起来了，它会阻塞后面的代码，等着 Promise 对象 resolve，然后得到 resolve 的值，作为 await 表达式的运算结果。

> 看到上面的阻塞一词，心慌了吧……放心，这就是 await 必须用在 async 函数中的原因。async 函数调用不会造成阻塞，它内部所有的阻塞都被封装在一个 Promise 对象中异步执行。


<a id="markdown-asyncawait" name="asyncawait"></a>
### async/await 
-----

<a id="markdown-简单的比较" name="简单的比较"></a>
#### 简单的比较

用 setTimeout 模拟耗时的异步操作，先来看看不用 async/await 会怎么写

	function takeLongTime(){
		return new Promise(resolve => {
	        setTimeout(() => resolve("long_time_value"), 1000);
	    });
	}
	
	takeLongTime().then(v=>{
		console.log("got", v)
	})

用 async/await 

	function takeLongTime(){
		return new Promise(resolve => {
	        setTimeout(() => resolve("long_time_value"), 1000);
	    });
	}

	async function test() {
	    const v = await takeLongTime();
	    console.log(v);
	}
	
	test();

分析： 

眼尖的同学已经发现 takeLongTime() 没有申明为 async。实际上，takeLongTime() 本身就是返回的 Promise 对象，加不加 async 结果都一样。


又一个疑问产生了，这两段代码，两种方式对异步调用的处理（实际就是对 Promise 对象的处理）差别并不明显，甚至使用 async/await 还需要多写一些代码，那它的优势到底在哪？


<a id="markdown-asyncawait-的优势在于处理-then-链" name="asyncawait-的优势在于处理-then-链"></a>
### async/await 的优势在于处理 then 链
-------

单一的Promise链并不能发现async/await的优势， 但是，如果需要处理由多个Promise组成的then链的时候，优势就能体现出来了


假设一个业务，分多个步骤完成，每个步骤都是异步的，而且依赖于上一个步骤的结果。我们仍然用 setTimeout 来模拟异步操作：

	/**
	 * 传入参数 n，表示这个函数执行的时间（毫秒）
	 * 执行的结果是 n + 200，这个值将用于下一步骤
	 */
	function takeLongTime(n) {
	    return new Promise(resolve => {
	        setTimeout(() => resolve(n + 200), n);
	    });
	}
	
	function step1(n) {
	    console.log(`step1 with ${n}`);
	    return takeLongTime(n);
	}
	
	function step2(n) {
	    console.log(`step2 with ${n}`);
	    return takeLongTime(n);
	}
	
	function step3(n) {
	    console.log(`step3 with ${n}`);
	    return takeLongTime(n);
	}


现在用 Promise 方式来实现这三个步骤的处理


	function doIt() {
	    console.time("doIt");
	    const time1 = 300;
	    step1(time1)
	        .then(time2 => step2(time2))
	        .then(time3 => step3(time3))
	        .then(result => {
	            console.log(`result is ${result}`);
	            console.timeEnd("doIt");
	        });
	}
	
	doIt();

输出结果 result 是 step3() 的参数 700 + 200 = 900。doIt() 顺序执行了三个步骤，一共用了 300 + 500 + 700 = 1500 毫秒，和 console.time()/console.timeEnd() 计算的结果一致。


用 async/await 来实现

	async function doIt() {
	    console.time("doIt");
	    const time1 = 300;
	    const time2 = await step1(time1);
	    const time3 = await step2(time2);
	    const result = await step3(time3);
	    console.log(`result is ${result}`);
	    console.timeEnd("doIt");
	}
	
	doIt();

结果和之前的 Promise 实现是一样的，但是这个代码看起来是不是清晰得多，几乎跟同步代码一样


进一步
------

业务要求改一下，仍然是三个步骤，但每一个步骤都需要之前每个步骤的结果。


	function step1(n) {
	    console.log(`step1 with ${n}`);
	    return takeLongTime(n);
	}
	
	function step2(m, n) {
	    console.log(`step2 with ${m} and ${n}`);
	    return takeLongTime(m + n);
	}
	
	function step3(k, m, n) {
	    console.log(`step3 with ${k}, ${m} and ${n}`);
	    return takeLongTime(k + m + n);
	}

用 async/await 来写：

	async function doIt() {
	    console.time("doIt");
	    const time1 = 300;
	    const time2 = await step1(time1);
	    const time3 = await step2(time1, time2);
	    const result = await step3(time1, time2, time3);
	    console.log(`result is ${result}`);
	    console.timeEnd("doIt");
	}
	
	doIt();


把它写成 Promise 方式实现会是什么样子？


	function doIt() {
	    console.time("doIt");
	    const time1 = 300;
	    step1(time1)
	        .then(time2 => {
	            return step2(time1, time2)
	                .then(time3 => [time1, time2, time3]);
	        })
	        .then(times => {
	            const [time1, time2, time3] = times;
	            return step3(time1, time2, time3);
	        })
	        .then(result => {
	            console.log(`result is ${result}`);
	            console.timeEnd("doIt");
	        });
	}
	
	doIt();