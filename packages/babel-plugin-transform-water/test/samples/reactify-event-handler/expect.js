export default (target, props) => {
  expect(target.getAttribute('foo')).toBe('1');
  target.click();
  expect(target.getAttribute('foo')).toBe('2');
};
