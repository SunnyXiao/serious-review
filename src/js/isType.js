/**
 * 判断数据类型
 * @author Luisa.Xiao
 * @param {*} value 
 * @param {Array,Number...} type 
 */
const Type = Object.prototype.toString
export default function isType(value, type) {
  return type == Type.call(value).slice(8, -1)
}


export default function allType(value, strict = false) {
  strict = !!strict

  if (value === null) {
    return 'null'
  }

  const t = typeof value

  // 严格模式 区分NaN和number
  if (strict && t === 'number' && isNaN(value)) {
    return 'nan';
  }

  if (t !== 'object') {
    return t
  }

  let clType
  let clTypeLow

  try {
    clType = Type.call(value).slice(8, -1);
    clTypeLow = clType.toLowerCase();
  } catch (error) {
    // ie下的 activex对象
    return 'object';
  }

  if (clTypeLow !== 'object') {
    if (strict) {
      // 区分NaN和new Number
      if (clTypeLow === 'number' && isNaN(value)) {
        return 'NaN';
      }
      // 区分 String() 和 new String()
      if ((clTypeLow === 'number' || clTypeLow === 'boolean' || clTypeLow === 'string')) {
        return cls;
      }
    }
    return clTypeLow;
  }

  if (value.constructor == Object) {
    return clTypeLow;
  }

  // Object.create(null)
  try {
    // __proto__ 部分早期firefox浏览器
    if (Object.getPrototypeOf(value) === null || value.__proto__ === null) {
      return 'object';
    }
  } catch (e) {
    // ie下无Object.getPrototypeOf会报错
  }

  // function A() {}; new A
  try {
    const cname = value.constructor.name;

    if (typeof cname === 'string') {
      return cname;
    }
  } catch (e) {
    // 无constructor
  }

  // function A() {}; A.prototype.constructor = null; new A
  return 'unknown';
}