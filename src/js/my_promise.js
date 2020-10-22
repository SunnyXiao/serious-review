/*
 * @Author: your name
 * @Date: 2020-03-29 15:48:48
 * @LastEditTime: 2020-06-05 17:07:57
 * @LastEditors: Please set LastEditors
 * @Description:来源：https://juejin.im/post/5e3b9ae26fb9a07ca714a5cc
 * @FilePath: /school-online/work/xly/project/serious-review/src/js/my_promise.js
 */

// 判断变量否为function
const isFunction = variable => typeof variable === 'function';
// 定义Promise的三种状态常量
const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'
class MyPromise {
  // MyPromise.resolve('dd')
  static resolve(value) {
    // 根据规范, 如果参数是Promise实例, 直接return这个实例
    if (value instanceof MyPromise) return value
    return new MyPromise(resolve => resolve(value))
  }

  //静态的reject方法
  static reject(reason) {
    return new MyPromise((resolve, reject) => reject(reason))
  }

  //静态的all方法
  static all(promiseArr) {
    let index = 0;
    let result = []
    return new MyPromise((resolve, reject) => {
      promiseArr.forEach((element, _index) => {
        MyPromise.resolve(element).then(val => {
          index++;
          result[_index] = val;
          if (index === promiseArr.length) {
            resolve(result)
          }
        }, error => {
          reject(err)
        })
      });
    })
  }

  //静态的race方法
  static race(promiseArr) {
    return new MyPromise((resolve, reject) => {
      //同时执行Promise,如果有一个Promise的状态发生改变,就变更新MyPromise的状态
      for (let p of promiseArr) {
        MyPromise.resolve(p).then( //Promise.resolve(p)用于处理传入值不为Promise的情况
          value => {
            resolve(value) //注意这个resolve是上边new MyPromise的
          },
          err => {
            reject(err)
          }
        )
      }
    })
  }

  constructor(executor) {
    this._status = PENDING;
    this._value = undefined;
    this._resolveQueue = [];
    this._rejectQueue = [];

    let _resolve = (val) => {
      console.log('val')
      const run = () => {
        if (this._status !== PENDING) return;
        this._status = FULFILLED;
        this._value = val;
        console.log(this._resolveQueue)
        // 这里之所以使用一个队列来储存回调,是为了实现规范要求的 "then 方法可以被同一个 promise 调用多次"
        // 如果使用一个变量而非队列来储存回调,那么即使多次p1.then()也只会执行一次回调
        while (this._resolveQueue.length) {
          const callback = this._resolveQueue.shift();
          callback(val);
        }
      }
      setTimeout(run);
    };

    let _reject = (val) => {
      const run = () => {
        if (this._status !== PENDING) return;
        this._status = REJECTED;
        this._value = val;
        while (this._rejectQueue.length) {
          const callback = this._rejectQueue.shift();
          callback(val);
        }
      }
      setTimeout(run);
    };
    try {
      executor(_resolve, _reject);
    } catch (error) {
      _reject(error)
    }

  }

  // then链式调用
  then(resolveFn, rejectFn) {
    console.log('then');
    // 根据规范，如果then的参数不是function，则我们需要忽略它, 让链式调用继续往下执行
    typeof resolveFn !== 'function' ? resolveFn = value => value : null
    typeof rejectFn !== 'function' ? rejectFn = reason => {
      throw new Error(reason instanceof Error ? reason.message : reason);
    } : null

    // return一个新的promise
    return new MyPromise((resolve, reject) => {
      // 把resolveFn重新包装一下,再push进resolve执行队列,这是为了能够获取回调的返回值进行分类讨论
      const fulfilledFn = value => {
        try {
          //执行第一个(当前的)Promise的成功回调,并获取返回值
          let x = resolveFn(value);
          //分类讨论返回值,如果是Promise,那么等待Promise状态变更,否则直接resolve
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error);
        }
      }

      //reject同理
      const rejectedFn = error => {
        try {
          let x = rejectFn(error)
          x instanceof MyPromise ? x.then(resolve, reject) : resolve(x)
        } catch (error) {
          reject(error)
        }
      }

      switch (this._status) {
        case PENDING:
          //把后续then收集的依赖都push进当前Promise的成功回调队列中(_rejectQueue), 这是为了保证顺序调用
          this._resolveQueue.push(fulfilledFn);
          this._rejectQueue.push(rejectedFn)
          break;

          // 当状态已经变为resolve/reject时,直接执行then回调
        case FULFILLED:
          fulfilledFn(this._value) // this._value是上一个then回调return的值(见完整版代码)
          break;
        case REJECTED:
          rejectedFn(this._value)
          break;
      }
    })
  }

  //catch方法其实就是执行一下then的第二个回调
  catch (rejectFn) {
    return this.then(undefined, rejectFn)
  }

}

const p1 = new MyPromise((resolve, reject) => {
  console.log('hello promise');
  resolve('resolve');
})

p1.then(res => {
  console.log(res);
  return 2
}).then(res => {
  console.log(res);
  return 3
})


///如何通过Promise对象实现ajax？

var myXhr = function (options) {
  let promise = new Promise(function (resolve, reject) {
    let {
      url,
      method,
      async,
      body
    } = options

    async = async ||true;
    let xhr = new XMLHttpRequest();

    xhr.open(method, url, async);
    xhr.responseType = 'json';
    xhr.setRequestHeader("Accept", "application/json")
    xhr.send(body);

    xhr.onreadystatechange = function () {
      if (this.readyState != 4) {
        return
      }
      if (this.status == 200) {
        resolve(this.response)
      } else {
        reject(new Error(this.statusText))
      }
    }

    xhr.abort

  })
}