import * as api from './api';
import { useNavigate } from "react-router-dom";

export const NewGamePage = () => {
  const navigate = useNavigate();

  const handleNewRoom = async () => {
    const roomId = await api.newRoom();
    console.log(roomId);
    navigate(`/room/${roomId}`);
  }

  return <div>
    <div>New Game Page</div>
    <button onClick={handleNewRoom} className='bg-blue-500 text-white rounded-md p-1'>New Room</button>
  </div>
};
