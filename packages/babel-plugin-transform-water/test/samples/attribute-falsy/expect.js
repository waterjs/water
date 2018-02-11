export default target => {
  expect(target.getAttribute('foo')).toBe(null);
  expect(target.getAttribute('bar')).toBe(null);
  expect(target.getAttribute('wolf')).toBe(null);
};
