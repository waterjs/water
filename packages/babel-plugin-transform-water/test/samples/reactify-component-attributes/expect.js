export default (target, props) => {
  const previousElement = target.childNodes[0];
  expect(target.childNodes[0].getAttribute('bar')).toBe('foo');
  props.next();
  const currentElement = target.childNodes[0];
  expect(target.childNodes[0].getAttribute('bar')).toBe('bar');
  expect(previousElement).toBe(currentElement);
};
