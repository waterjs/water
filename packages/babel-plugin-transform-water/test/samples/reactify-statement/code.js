export default ({ next }) => {
  let foo = false;
  let bar = false;

  next(() => {
    foo = true;
  });

  next(() => {
    bar = true;
  });

  return <div result={foo && bar ? 'truthy' : 'falsy'} />;
};
