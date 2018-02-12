const Component = ({ foo }) => <div bar={foo} />;

export default ({ next }) => {
  let state = 'foo';

  next(() => {
    state = 'bar';
  });

  return (
    <div>
      <Component foo={state} />
    </div>
  );
};
