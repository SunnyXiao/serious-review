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


/**
 * 
 * @description: 模拟new 操作符
 */
function mockNew(ctor){
  if(typeof ctor !== 'function') throw 'mockNew function the first param must be a function';

  // ES6 new.target 是指向构造函数
  mockNew.target = ctor;

  // 1.创建一个全新的对象，
  // 2.并且执行[[Prototype]]链接
  // 4.通过`new`创建的每个对象将最终被`[[Prototype]]`链接到这个函数的`prototype`对象上。
  var newObj = Object.create(ctor.prototype);

  var argsArr = [...arguments];
  // 3.生成的新对象会绑定到函数调用的`this`。
  // 获取到ctor函数返回结果
  var ctorReturnResult = ctor.apply(newObj, argsArr);
  var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
  var isFunction = typeof ctorReturnResult === 'function';
  if(isObject || isFunction){
      return ctorReturnResult;
  }
    // 5.如果函数没有返回对象类型`Object`(包含`Functoin`, `Array`, `Date`, `RegExg`, `Error`)，那么`new`表达式中的函数调用会自动返回这个新的对象。
    return newObj
}