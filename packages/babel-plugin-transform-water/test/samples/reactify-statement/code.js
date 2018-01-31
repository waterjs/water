export default () => {
  let foo = false;
  let bar = false;

  setTimeout(() => {
    foo = true;
  }, 0);

  setTimeout(() => {
    bar = true;
  }, 5);

  return <div result={foo && bar ? 'truthy' : 'falsy'} />;
};
