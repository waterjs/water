export default target => {
  expect(target.tagName).toBe('UL');

  const children = target.childNodes;
  expect(children.length).toBe(2 + 1);
  for (let i = 0; i < children.length - 1; i++) {
    expect(children[i].tagName).toBe('LI');
  }
};
