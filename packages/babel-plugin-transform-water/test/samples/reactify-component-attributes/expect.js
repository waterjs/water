export default (target, props) => {
  expect(target.childNodes[0].getAttribute('bar')).toBe('foo');
  props.next();
  expect(target.childNodes[0].getAttribute('bar')).toBe('bar');
};
