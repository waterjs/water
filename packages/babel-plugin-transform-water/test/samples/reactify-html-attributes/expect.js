export default (target, props) => {
  expect(target.getAttribute('foo')).toBe('1');
  props.next();
  expect(target.getAttribute('foo')).toBe('2');
};
