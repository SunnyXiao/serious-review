<!--
 * @Author: your name
 * @Date: 2020-03-29 15:58:02
 * @LastEditTime: 2020-03-29 18:34:57
 * @LastEditors: Please set LastEditors
 * @Description:Promise/async、await/Generator
 * @FilePath: /school-online/work/xly/project/serious-review/src/summary/javascript/JS中Promise、Generator原理解析.md
 -->

### Promise

首先看一个简单的Promise使用：
```
  const p = new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('hello')
    },1000)
  })
```

通过这个例子，分Promise的调用流程：

- Promise 的构造方法接受一个executor(),在new Promise()时就立即执行这个executor回调；
- executor()内部的异步任务被放入宏/微任务队列，等待执行；
- then()被执行，收集成功/失败回调，放入成功和失败的队列中；
- executor()的异步任务被执行，触发resolve/reject，

从过程中看这个模式是‘观察者模式’， 在Promise里头，执行顺序是then收集依赖 -> 异步触发resolve -> resolve执行依赖。简单的Promise实现如下：

```
  class MyPromise {
    constructor(executor){
      this._resolveQueue=[];
      this._rejectQueue = [];

      let _resolve = val => {
        const run = () => {
          while(this._resolveQueue.length) {
            const callback = this._resolveQueue.shift();
            callback(val);
          }
        }
        setTimeout(run);
      };

      let _reject = val => {
        const run = () => {
          while(this._rejectQueue.length) {
            const callback = this._rejectQueue.shift();
            callback(val);
          }
        }
        setTimeout(run);
      };

      executor(_resolve,_reject);
    }

    then(resolveFn,rejectFn) {
      this._resolveQueue.push(resolveFn);
      this._rejectQueue.push(rejectFn);
    }
  }
```

### async/await实现
简单例子

```
	async () => {
	  const a = await Promise.resolve(a);
	  const b = await Promise.resolve(b);
	  const c = await Promise.resolve(c);
	}

```


async 函数的实现原理，就是将 Generator 函数和自动执行器，包装在一个函数里.首先看Generator的用法：

	function* gen(x) {
	  var y = yield x + 2;
	  return y;
	}
	
	var g = gen(1);
	g.next() // { value: 3, done: false }
	g.next() // { value: undefined, done: true }


Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

next返回值的value属性，是Generator函数向外输出数据； next方法还可以接受参数，向 Generator 函数体内输入数据。

	function* gen(x){
	  var y = yield x + 2;
	  return y;
	}
	
	var g = gen(1);
	g.next() // { value: 3, done: false }
	g.next(2) // { value: 2, done: true }

Generator的用法， */yield 和 async/await看起来很相似。他们都提供了暂停执行的功能，但是也有区别：

- async/await 自带执行器，不需要手动调用next()就能自动执行下一步；
- async函数返回值是Promise对象，而Generator返回的是生成器对象；
- await能够返回Promise的resolve/reject的值；

```

	async function fn(args) {
	  // ...
	}
	
	// 等同于
	
	function fn(args) {
	  return spawn(function* () {
	    // ...
	  });
	}

```
如何实现async的自动执行器呢？

```

	function spawn(fenF){
		return new Promise((resolve, reject)=>{
			const gen = genF();
			function step(nextF){
				let next;
				try {
					next = nextF()
				} catch (e){
					return reject(e);
				}
				if(next.done){
					return resove(next.value)
				}
				Promise.resolve(next.value).then(function(v) {
			        step(function() { return gen.next(v); });
			      }, function(e) {
			        step(function() { return gen.throw(e); });
			    });
			}
			step(function(){return gen.next(undefined);})
		})
	}

```