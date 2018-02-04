const Item = ({ foo }) => <li foo={foo} />;

const List = () => (
  <ul>
    <Item foo='foo' />
    <Item foo='foo' />
  </ul>
);

export default List;
