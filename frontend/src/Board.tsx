import { useEffect, useState } from 'react';
import logo from './duel52-logo.svg';
import { GameActions } from './store';
import { Hand } from './Hand';
import { Lane, LaneSeparator } from './Lane';
import { useAppDispatch, useAppSelector } from './store';
import { TurnManager } from './TurnManager';
import { StackCards } from './CardStacks';
import * as api from './api';
import { ActionButton } from './ActionButton';
import { getSocket } from './api/socket';
import { useParams } from 'react-router-dom';


export const Board = () => {
  const gameState = useAppSelector((state) => state.game.gameState);
  const { playerId } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const [started, setStarted] = useState(false);
  const { roomId } = useParams();

  // useEffect(() => {
  //   api.newGame().then(response => {
  //     console.log({ response });
  //     setStarted(true);
  //     dispatch(GameActions.updateState(response.data));
  //   })
  // }, [dispatch]);
  useEffect(() => {
    api.getGameState(roomId, playerId!)
      .then(response => {
        dispatch(GameActions.updateState(response));
        setStarted(true);
      }).catch(error => {
        console.log({ firstGetGameStateError: error });
      });
    const socket = getSocket();
    socket.on('state-updated', () => {
      api.getGameState(roomId, playerId!)
        .then(data => {
          dispatch(GameActions.updateState(data));
        })
        .catch(error => {
          console.log({ getGameStateError: error });
        });
    })

    return () => {
      socket.off('state-updated');
    };
  }, []);

  if (!started) {
    return <div>Loading</div>
  }

  return (
    <div className="bg-emerald-500/75 w-screen h-screen flex px-2">
      <StackCards className='self-center' title='Draw pile' quantity={gameState.gameInfo.drawPile} />
      <div className='flex flex-1 flex-col relative justify-between items-center'>

        <div style={{ zIndex: -1 }} className='absolute inset-0 flex justify-center items-center'>
          <img alt='Duel 52 logo' src={logo} className="w-1/5 opacity-50" />
        </div>

        <Hand handSize={gameState.opponent.hand} className="mt-2 w-3/4" />

        <div className='flex flex-1 my-2 w-3/4'>
          <Lane className='' index={0} />
          <LaneSeparator />
          <Lane className='' index={1} />
          <LaneSeparator />
          <Lane className='' index={2} />
        </div>

        <Hand cards={gameState.I.hand} className="mb-2 w-3/4" />
      </div>
      <div className='flex flex-col relative'>
        <div className={`flex items-center absolute h-full`} >
          <StackCards className='' title='Discard pile' quantity={gameState.gameInfo.discardPile} />
        </div>
        <TurnManager className='mb-5 mt-auto z-0' />
        <ActionButton />
      </div>
    </div>
  );
}

