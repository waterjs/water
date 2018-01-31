export default target => {
  expect(target.getAttribute('foo')).toBe('1')
  expect(target.getAttribute('bar')).toBe('2')
}
