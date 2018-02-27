export default (target, props) => {
  expect(target.childNodes.length).toBe(props.list.length);
  props.next();
  expect(target.childNodes.length).toBe(0);
  props.next();
  expect(target.childNodes.length).toBe(props.list.length);
};
