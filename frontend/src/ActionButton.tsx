import { Actions, TurnStatus } from "./store/StateTypes";
import * as api from './api';
import { GameActions, useAppDispatch, useAppSelector } from "./store";
import { useParams } from "react-router-dom";

type ActionButtonProps = {};

export function ActionButton({ }: ActionButtonProps) {
  const gameState = useAppSelector((state) => state.game.gameState);
  const dispatch = useAppDispatch();
  const { selectedCard, currentAction, attackedCard, secondAttacked } = useAppSelector((state) => state.game);
  const { roomId } = useParams();

  const endTurn = () => {
    api.endTurn(roomId,)
      .then(response => {
        console.log({ responseEndTurn: response });
        dispatch(GameActions.updateState(response.data));
      })
      .catch(error => {
        console.log({ error });
      });
  }

  const flipCard = () => {
    api.flipCard(roomId, selectedCard!.id)
      .then(response => {
        console.log({ responseFlipCard: response });
        dispatch(GameActions.updateState(response.data));
        dispatch(GameActions.clearSelected());
      })
      .catch(error => {
        console.log({ errorFlipCard: error });
      });
  }

  const discardCard = () => {
    api.discardCard(roomId, selectedCard!.id)
      .then(response => {
        console.log({ discardCardResponse: response.data });
        dispatch(GameActions.updateState(response.data));
      })
      .catch(error => {
        console.log({ discardCardError: error });
      })
  }

  const attack = () => {
    api.attack(roomId, selectedCard!.id, attackedCard!.id, secondAttacked?.id)
      .then(response => {
        console.log({ attackResponse: response.data });
        dispatch(GameActions.updateState(response.data));
        dispatch(GameActions.clearSelected());
      })
      .catch(error => {
        console.log({ attackError: error });
      })
  };

  if (!gameState.turnInfo.isMyTurn) {
    return <div></div>;
  }

  if (gameState.turnInfo.currentState === TurnStatus.WAITING_CHOOSE_DISCAR_CARD) {
    return <button
      className='mb-10 py-1 bg-green-500 text-white rounded-md z-0'
      onClick={discardCard}
    >Discard</button>
  }

  if (currentAction === Actions.FLIP_CARD) {
    return <button
      className='mb-10 py-1 bg-green-500 text-white rounded-md z-0'
      onClick={flipCard}
    >Flip Card</button>
  }

  if (currentAction === Actions.ATTACK) {
    return <button
      className='mb-10 py-1 bg-green-500 text-white rounded-md z-0'
      onClick={attack}
    >Attack</button>
  }

  if (gameState.turnInfo.currentState === TurnStatus.WAITING_NEXT_ACTION) {
    return <button
      className='mb-10 py-1 bg-red-500 text-white rounded-md z-0'
      onClick={endTurn}
    >End turn</button>
  }

  return <div></div>
}
