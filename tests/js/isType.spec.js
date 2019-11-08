import isType from '../../src/js/isType'
test('String', () => {
  expect(isType('hello')).toBe('String');
});

test('Number', () => {
  expect(isType(456)).toBe('Number');
});

test('Boolean', () => {
  expect(isType(true)).toBe('Boolean');
});

test('Undefined', () => {
  expect(isType(undefined)).toBe('Undefined');
});

test('Null', () => {
  expect(isType(null)).toBe('Null');
});

test('Symbol', () => {
  expect(isType(Symbol('fff'))).toBe('Symbol');
});

test('Array', () => {
  expect(isType([1,2,3,4])).toBe('Array');
});

test('Object', () => {
  expect(isType({})).toBe('Object');
});