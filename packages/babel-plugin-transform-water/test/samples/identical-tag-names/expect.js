export default target => {
  expect(target.tagName).toBe('DIV');
  expect(target.childNodes[0].tagName).toBe('DIV');
  expect(target.childNodes[0].childNodes[0].tagName).toBe('DIV');
};
