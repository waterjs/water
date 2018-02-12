export default ({ next }) => {
  let foo = 1;

  next(() => {
    foo = 2;
  });

  return <div foo={foo} />;
};
