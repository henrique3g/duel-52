import { useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import logo from './duel52-logo.svg';
import { changePlayer } from './store';
import { Hand } from './Hand';
import { Lane, LaneSeparator } from './Lane';
import { useAppDispatch, useAppSelector } from './store';
import { TurnManager } from './TurnManager';


export const Board = () => {
  const { currentPlayer } = useAppSelector((state) => state.game.round);
  const { opponentHandSize, playerHand } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log(opponentHandSize)
    console.log(playerHand)
  }, []);

  return <div className="bg-emerald-500/75 w-screen h-screen flex flex-col justify-between items-center">
    <div className='absolute inset-0 flex justify-center items-center'>
      <img src={logo} className="w-1/5 opacity-50"/>
    </div>

    <div
      className={`absolute right-10 inset-y-0 flex flex-col z-10 ${currentPlayer === 1 ? 'justify-start' : 'justify-end'}`}
      onClick={() => dispatch(changePlayer())}
    >
      <TurnManager className='my-20' />
    </div>
    <Hand handSize={opponentHandSize} className="mt-2 w-3/4" />

    <div className='flex flex-1 my-2 w-3/4'>
      <Lane className='' />
      <LaneSeparator />
      <Lane className='' />
      <LaneSeparator />
      <Lane className='' />
    </div>

    <Hand cards={playerHand} className="mb-2 w-3/4" />
  </div> 
}

