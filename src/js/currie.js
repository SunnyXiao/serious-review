/*
 * @Author: your name
 * @Date: 2019-11-12 15:54:26
 * @LastEditTime: 2020-04-17 11:28:54
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \fluter_appe:\workspace\My projects\serious-review\src\js\currie.js
 */
/**
 * @description: 函数柯里化
 * @author: Luisa.Xiao
 * @example: function sum(a, b, c) {console.log(a + b + c);}
 * const fn = curry(sum)
 * fn(1, 2, 3); // 6
 * fn(1, 2)(3); // 6
 * fn(1)(2, 3); // 6
 * fn(1)(2)(3); // 6
 */
export default function curry(fn, ...arg) {
  let all = arg || [],
    _len = fn.length; // fn参数的个数
  return (...rest) => {
    let _arg = all.splice(0); //拷贝新的all，避免改动公有的all属性，导致多次调用_args.length出错
    _arg.push(...rest);
    if (_arg.length < _len) {
      return curry.call(this, fn, ..._arg)
    } else {
      return fn.apply(this, _arg)
    }
  }
}