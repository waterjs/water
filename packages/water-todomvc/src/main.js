import App from './App';
import id from './id';

let data = [
  {
    id: id(),
    title: 'to clear the table',
    completed: false,
  },
  {
    id: id(),
    title: 'to sweep the floor',
    completed: true,
  },
]

document.body.appendChild(<App todos={data} />);
