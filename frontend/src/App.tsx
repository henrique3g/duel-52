import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { getSocket } from './api/socket';
import './App.css';
import { Board } from './Board';
import { NewGamePage } from './NewGamePage';
import { RoomPage } from './RoomPage';
import { store } from './store/store';

const router = createBrowserRouter([
  {
    path: '/room/:roomId/game',
    element: <Board />,
  },
  {
    path: '/room/:roomId',
    element: <RoomPage />,
  },
  {
    path: '/',
    element: <NewGamePage />,
  },
]);

const socket = getSocket();
socket.on('connect', () => {
  console.log('Connected: ' + socket.id);
  socket.emit('events', { hello: 'world' });
});

socket.on('game-state', (args) => {
  console.log({ args });
});

socket.on('events', (args) => {
  console.log({ events: args });
});

window.onclose = () => {
  console.log('disconnect');
  socket.disconnect();
}

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </div>
  );
}

export default App;
