export default (target, props) => {
  expect(target.getAttribute('result')).toBe('falsy');
  props.next();
  expect(target.getAttribute('result')).toBe('falsy');
  props.next();
  expect(target.getAttribute('result')).toBe('truthy');
};
