/**
 * @description: call() 方法调用一个函数, 其具有一个指定的this值和分别地提供的参数。
 * @example: 语法：fun.call(thisArg, arg1, arg2)
 */
Function.prototype.call=function() {
  const [thisArg, ...args] = [...arguments]
  if (!thisArg) {
    thisArg = typeof window === 'undefined' ? global : window
  }
  // this指向的是当前函数func(func.call)
  thisArg.func = this
  let result = thisArg.func(...args)
  delete thisArg.func // thisArg上并没有func属性，因此要移除
  return result
}

Function.prototype.apply = function(thisArg, rest) {
  if(!thisArg){
    thisArg = typeof window === 'undefind' ? global : window
  }
  thisArg.func = this
  let result
  if (!rest) {
    result = thisArg.func()
  } else {
    result = thisArg.func(...rest)
  }
  delete thisArg.func // thisArg上并没有func属性，因此要移除
  return result
}