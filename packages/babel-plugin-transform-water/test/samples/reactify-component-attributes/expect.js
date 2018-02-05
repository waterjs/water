export default (target, props) => {
  expect(target.childNodes[0].getAttribute('bar')).toBe('foo');
  return new Promise(resolve => {
    setTimeout(() => {
      expect(target.childNodes[0].getAttribute('bar')).toBe('bar');
      resolve();
    }, 0);
  });
};
