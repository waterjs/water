export default () => {
  let foo = 'foo';

  function onChange (event) {
    console.log('triggered');
    foo = event.target.value;
  }

  return (
    <div>
      <span>{ foo }</span>
      <input onChange={onChange} />;
    </div>
  );
};
