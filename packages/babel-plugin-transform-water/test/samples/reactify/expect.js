export default (target, props) => {
  expect(target.getAttribute('foo')).toBe('1');
  return new Promise(resolve => {
    setTimeout(() => {
      expect(target.getAttribute('foo')).toBe('2');
      resolve();
    }, 0);
  });
};
