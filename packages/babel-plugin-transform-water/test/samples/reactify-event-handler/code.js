export default () => {
  let foo = 1;

  function onClick () {
    foo = 2;
  }

  return <button foo={foo} onClick={onClick} />;
};
