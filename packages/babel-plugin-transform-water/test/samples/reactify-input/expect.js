export default (target) => {
  const span = target.querySelector('span');
  const input = target.querySelector('input');
  expect(span.textContent).toBe('foo');
  input.value = 'bar';
  const event = new Event('change');
  input.dispatchEvent(event);
  expect(span.textContent).toBe('bar');
};
