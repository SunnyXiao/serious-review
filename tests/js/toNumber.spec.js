import toNumber from '../../src/js/toNumber'

test("convert '3.4' to 3.4",()=>{
  expect(toNumber('3.4')).toBe(3.4)
})

test("convert Infinity to Infinity",()=>{
  expect(toNumber(Infinity)).toBe(Infinity)
})

test("Number.MIN_VALUE",()=>{
  expect(toNumber(Number.MIN_VALUE)).toBe(5e-324)
})