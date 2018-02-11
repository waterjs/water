export default target => {
  expect(target.getAttribute('foo')).toBe('foo');
  expect(target.getAttribute('bar')).toBe('bar');
};
