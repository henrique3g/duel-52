import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import * as api from './api';
import { getSocket } from "./api/socket";
import { GameActions, useAppDispatch } from "./store";
// import { useAppDispatch } from "./store";
// import { roomActions } from "./store/roomSlice";

export function RoomPage() {
  const { roomId } = useParams();
  const [ready, setReady] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (ready && gameStarted) {
      navigate(`/room/${roomId}/game`);
    }
  }, [ready, gameStarted]);
  useEffect(() => {
    const socket = getSocket();
    // socket.on('player-ready', (playerNick) => {
    // dispatch(roomActions.setOpponentReady(playerNick));
    // });
    socket.on('game-start', () => {
      setGameStarted(true);
    });
    return () => {
      // socket.off('player-ready');
      socket.off('game-start');
    };
  }, []);

  const handleClick = () => {
    api.setReady(roomId || '', nickname)
      .then(response => {
        console.log({ responseSetReady: response });
        dispatch(GameActions.setPlayer(response));
        setReady(true);
      })
      .catch(error => {
        console.log({ errorSetReady: error });
      });
  }
  return <div>
    <div>Room page {roomId}</div>
    <div className="">
      Enter you nickname:
      <input type="text" className="border-blue-500/80 rounded-md border shadow ml-1 p-1" onChange={(event) => setNickname(event.target.value)} value={nickname} />
      {!ready && <button onClick={handleClick} className="bg-green-400 p-1 px-2 rounded-md ml-2 text-white">Ready</button>}
    </div>
    <div className="">
      waiting opponent
    </div>
  </div>
}

