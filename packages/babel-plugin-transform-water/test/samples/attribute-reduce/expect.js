export default (target, props) => {
  expect(target.childNodes[0].getAttribute('bar')).toBe('foo-second');
};
