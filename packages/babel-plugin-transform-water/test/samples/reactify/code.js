export default () => {
  let foo = 1;

  setTimeout(() => {
    foo = 2;
  }, 0);

  return <div foo={foo} />;
};
