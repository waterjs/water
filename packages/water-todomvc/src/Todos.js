import Todo from './Todo';

export default ({ todos, filter, onRemoveTodo, onToggleTodo }) => (
  <ul>
    {
      todos.filter(filter).map(todo => <Todo id={todo.id} title={todo.title} completed={todo.completed} onRemove={onRemoveTodo} onToggle={onToggleTodo} />)
    }
  </ul>
)
