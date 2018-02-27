const FILTERS = {
  all: () => true,
  none: () => false,
};

export default ({ list, next }) => {
  let filter = 'all';

  next(() => {
    filter = 'none';
  });

  next(() => {
    filter = 'all';
  });

  return (
    <ul>
      { ({ list, filter }) => list.filter(FILTERS[filter]).map(item => <li>{ item }</li>) }
    </ul>
  );
};
