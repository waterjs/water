export default (target, props) => {
  target.click();
  expect(props.onClick).toHaveBeenCalled();
};
