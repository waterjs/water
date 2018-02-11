/* eslint react/jsx-no-duplicate-props: 0 */

const Component = ({ foo }) => <div bar={foo} />;

export default () => {
  const foo = 'foo';

  return (
    <div>
      <Component foo={`${foo}-first`} foo={`${foo}-second`} />
    </div>
  );
};
