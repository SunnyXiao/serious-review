import curry from '../../src/js/currie';
test('测试柯里化函数sum',()=>{
  function sum(a,b,c) {
    return a+b+c;
  }
  let sumFn = curry(sum)
  expect(sumFn(1)(2)(3)).toBe(6)
  expect(sumFn(1)(2,3)).toBe(6)
})