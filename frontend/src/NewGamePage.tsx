import { useEffect } from "react";
import { io } from "socket.io-client";

export const NewGamePage = () => {
  useEffect(() => {
    const socket = io('http://localhost:8082');
    socket.on('connect', function() {
      console.log('Connected');
      socket.emit('events', { hello: 'world' });
    });
    socket.on('game-state', (args) => {
      console.log({ args });
    })
  }, []);
  return <div>New Game Page</div>
};
