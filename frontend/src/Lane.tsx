import { CardElement, isHiddenCard } from "./Card";
import { canClickBoardCardSelector, GameActions, useAppDispatch, useAppSelector } from "./store";
import { Actions, Card, HiddenCard, TurnStatus } from "./store/StateTypes";
import * as api from './api';
import { useParams } from "react-router-dom";

type LaneProps = {
  index: number;
  className?: string;
};

export const Lane = ({ index: number, className }: LaneProps) => {
  const { I, opponent, turnInfo } = useAppSelector(state => state.game.gameState);
  const { currentAction, selectedCard } = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const myBaseCard = I.board[number].baseCard;
  const opponentBaseCard = opponent.board[number].baseCard;
  const myCards = I.board[number].cards;
  const opponentCards = opponent.board[number].cards;
  const availabilityClass = currentAction === Actions.SET_CARD ? 'border-2 border-blue-500' : '';
  const canClickBoardCard = useAppSelector(canClickBoardCardSelector);
  const { roomId } = useParams();

  const handleClickLane = () => {
    if (currentAction !== Actions.SET_CARD) {
      return;
    }
    console.log({ selectedCard })
    api.setCard(roomId, selectedCard!.id, number)
      .then(response => {
        dispatch(GameActions.clearSelected());
        dispatch(GameActions.updateState(response.data));
      })
      .catch(error => {
        console.log({ setCardError: error });
      })
  };

  const handleClickMyCard = (card: Card) => () => {
    if (!canClickBoardCard) {
      return;
    }
    if (turnInfo.currentState === TurnStatus.WAITING_CHOOSE_CARD_TO_SEE) {
      api.seeCard(roomId, card.id)
        .then(response => {
          console.log({ seeCardResponse: response.data });
          dispatch(GameActions.updateState(response.data));
        })
        .catch(error => {
          console.log({ seeCardError: error });
        })
      return;
    }
    if (turnInfo.currentState === TurnStatus.WAITING_CHOOSE_FLIP_ORDER) {
      api.selectCardToFlip(roomId, card.id)
        .then(response => {
          console.log({ flipCardAbilityResponse: response.data });
          dispatch(GameActions.updateState(response.data));
        })
        .catch(error => {
          console.log({ flipCardAbilityError: error });
        })
      return;
    }
    if (turnInfo.currentState === TurnStatus.WAITING_CHOOSE_REACTIVATION_ORDER) {
      api.selectCardToReactivate(roomId, card.id)
        .then(response => {
          console.log({ reactivateCardAbilityResponse: response.data });
          dispatch(GameActions.updateState(response.data));
        })
        .catch(error => {
          console.log({ reactivateCardAbilityError: error });
        })
      return;
    }
    dispatch(GameActions.selectBoardCard(card))
  };


  const handleClickOtherCards = (card: Card | HiddenCard) => () => {
    if (!canClickBoardCard) {
      return;
    }
    if (turnInfo.currentState === TurnStatus.WAITING_CHOOSE_CARD_TO_SEE) {
      api.seeCard(roomId, card.id)
        .then(response => {
          console.log({ seeCardResponse: response.data });
          dispatch(GameActions.updateState(response.data));
        })
        .catch(error => {
          console.log({ seeCardError: error });
        })
      return;
    }
    if (turnInfo.currentState === TurnStatus.WAITING_NEXT_ACTION && currentAction === Actions.ATTACK) {
      dispatch(GameActions.addAttacked(card));
    }
  };

  return (
    <div
      className={`h-full bg-emerald-400/50 rounded-md p-1 flex-1 flex flex-col justify-between ${className} ${availabilityClass}`}
      onClick={handleClickLane}
    >
      <div className="justify-center flex ">
        {opponentBaseCard !== null && <CardElement card={opponentBaseCard} onClick={handleClickOtherCards(opponentBaseCard)} />}
      </div>

      <div className="mb-1 flex gap-1 flex-wrap">
        {opponentCards.map(card => (
          <CardElement card={card} key={card.id} isHidden={isHiddenCard(card) ? true : !(card as Card).isFlipped} onClick={handleClickOtherCards(card)} />
        ))}
      </div>

      <div className="mt-1 flex gap-1 flex-wrap">
        {myCards.map(card => (
          <CardElement card={card} key={card.id} isHidden={!card.isFlipped} onClick={handleClickMyCard(card)} />
        ))}
      </div>
      <div className="justify-center flex">
        {myBaseCard !== null && <CardElement card={myBaseCard} onClick={handleClickOtherCards(myBaseCard)} />}
      </div>
    </div>
  );
}

export const LaneSeparator = () => (
  <div className="bg-gray-500/10 w-0.5 mx-1"></div>
);
