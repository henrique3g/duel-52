import { useEffect, useState } from 'react';
import logo from './duel52-logo.svg';
import { GameActions } from './store';
import { Hand } from './Hand';
import { Lane, LaneSeparator } from './Lane';
import { useAppDispatch, useAppSelector } from './store';
import { TurnManager } from './TurnManager';
import axios from 'axios';


export const Board = () => {
  const { gameState } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const [started, setStarted] = useState(false);

  useEffect(() => {
    axios.post('http://localhost:4000/game').then(response => {
      console.log({ response });
      setStarted(true);
      dispatch(GameActions.updateState(response.data));
    })
  }, [dispatch]);

  if (!started) {
    return <div>Loading</div>
  }

  return <div className="bg-emerald-500/75 w-screen h-screen flex flex-col justify-between items-center">
    <div className='absolute inset-0 flex justify-center items-center'>
      <img alt='Duel 52 logo' src={logo} className="w-1/5 opacity-50" />
    </div>

    <div
      className={`absolute right-10 inset-y-0 flex flex-col z-10 ${gameState.turnInfo.isMyTurn ? 'justify-end' : 'justify-start'}`}
      onClick={() => dispatch(GameActions.changePlayer())}
    >
      <TurnManager className='my-20' />
    </div>
    <Hand handSize={gameState.opponent.hand} className="mt-2 w-3/4" />

    <div className='flex flex-1 my-2 w-3/4'>
      <Lane className='' number={ 0 } />
      <LaneSeparator />
      <Lane className='' number={ 1 } />
      <LaneSeparator />
      <Lane className='' number={ 2 } />
    </div>

    <Hand cards={gameState.I.hand} className="mb-2 w-3/4" />
  </div>
}

