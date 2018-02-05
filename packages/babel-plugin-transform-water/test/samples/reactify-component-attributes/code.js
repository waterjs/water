const Component = ({ foo }) => <div bar={foo} />;

export default () => {
  let state = 'foo';

  setTimeout(() => {
    state = 'bar';
  }, 0);

  return (
    <div>
      <Component foo={state} />
    </div>
  );
};
