export default (target, props) => {
  expect(target.getAttribute('result')).toBe('falsy');
  return new Promise(resolve => {
    setTimeout(() => {
      expect(target.getAttribute('result')).toBe('falsy');
    }, 0);

    setTimeout(() => {
      expect(target.getAttribute('result')).toBe('truthy');
      resolve();
    }, 5);
  });
};
