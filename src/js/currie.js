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
      _len = fn.length;
  return (...rest) =>{
    let _arg = all.splice(0); //拷贝新的all，避免改动公有的all属性，导致多次调用_args.length出错
    _arg.push(...rest);
    if (_arg.length < _len) {
      return curry.call(this,fn, ..._arg)
    } else {
      return fn.apply(this,_arg)
    }
  }
}