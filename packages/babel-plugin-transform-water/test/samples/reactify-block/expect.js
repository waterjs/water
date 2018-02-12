export default (target, props) => {
  expect(target.childNodes.length).toBe(props.list.length + 1);
  props.next();
  expect(target.childNodes.length).toBe(1);
  props.next();
  expect(target.childNodes.length).toBe(props.list.length + 1);
};
