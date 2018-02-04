const Item = ({ foo }) => <li foo={foo.bar} />;

const foo = { bar: 'bar' };

const List = () => (
  <ul>
    <Item foo={foo} />
    <Item foo={foo} />
  </ul>
);

export default List;
