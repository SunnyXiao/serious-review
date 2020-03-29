<!--
 * @Author: your name
 * @Date: 2020-03-29 15:58:02
 * @LastEditTime: 2020-03-29 18:34:57
 * @LastEditors: Please set LastEditors
 * @Description:Promise/async、await/Generator
 * @FilePath: /school-online/work/xly/project/serious-review/src/summary/javascript/JS中Promise、Generator原理解析.md
 -->


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