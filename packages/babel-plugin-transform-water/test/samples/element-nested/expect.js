export default target => {
  expect(target.tagName).toBe('UL')

  const children = target.childNodes
  expect(children.length).toBe(2)
  for (let i = 0; i < children.length; i++) {
    expect(children[i].tagName).toBe('LI')
  }
}
