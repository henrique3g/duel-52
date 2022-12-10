import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { Board } from './Board';
import { store } from './store/store';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Board />
      </Provider>
    </div>
  );
}

export default App;
