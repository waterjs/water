import Todos from './Todos';
import id from './id';

const FILTERS = {
  all: () => true,
  active: item => !item.completed,
  completed: item => item.completed,
};

export default ({ todos, onNewTodo }) => {
  let filter = 'all';

  function onFilterChange(event) {
    filter = event.target.value;
  }

  function onNewTodoSubmit(event) {
    event.preventDefault();

    const input = document.getElementById('new-todo');

    todos = [
      ...todos,
      {
        id: id(),
        title: input.value,
        completed: false,
      },
    ];

    input.value = '';
  }

  function onRemoveTodo(id) {
    todos = todos.filter(todo => todo.id !== id);
  }

  function onToggleTodo(id) {
    todos = todos.map(todo => {
      if (todo.id !== id) {
        return todo;
      }

      todo.completed = !todo.completed;
      return todo;
    });
  }

  return (
    <div>
      <input id="filter-all" type="radio" name="filter" value="all" onChange={onFilterChange} />
      <label for="filter-all">all</label>
      <input id="filter-active" type="radio" name="filter" value="active" onChange={onFilterChange} />
      <label for="filter-active">active</label>
      <input id="filter-completed" type="radio" name="filter" value="completed" onChange={onFilterChange} />
      <label for="filter-completed">completed</label>
      <form onSubmit={onNewTodoSubmit}>
        <input id="new-todo" type="text" />
        <button type="submit">Add</button>
      </form>
      <Todos todos={todos} filter={FILTERS[filter]} onRemoveTodo={onRemoveTodo} onToggleTodo={onToggleTodo} />
    </div>
  );
};
