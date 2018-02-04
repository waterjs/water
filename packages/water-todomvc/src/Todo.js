export default ({ id, title, completed, onRemove, onToggle }) => (
  <li className={ completed ? 'completed' : '' }>
    <input type="checkbox" onChange={() => onToggle(id)} checked={completed} />
    { title }
    <button onClick={() => onRemove(id)}>Remove</button>
  </li>
);
