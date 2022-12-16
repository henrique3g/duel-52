import { CardElement, isHiddenCard } from "./Card";
import { canClickBoardCardSelector, GameActions, useAppDispatch, useAppSelector } from "./store";
import { Actions, Card } from "./store/StateTypes";
import * as api from './api';

type LaneProps = {
  index: number;
  className?: string;
};

export const Lane = ({ index: number, className }: LaneProps) => {
  const { I, opponent } = useAppSelector(state => state.game.gameState);
  const { currentAction, selectedCard } = useAppSelector(state => state.game);
  const dispatch = useAppDispatch();
  const myBaseCard = I.board[number].baseCard;
  const opponentBaseCard = opponent.board[number].baseCard;
  const myCards = I.board[number].cards;
  const opponentCards = opponent.board[number].cards;
  const availabilityClass = currentAction === Actions.SET_CARD ? 'border-2 border-blue-500' : '';
  const canClickBoardCard = useAppSelector(canClickBoardCardSelector);

  const handleClickLane = () => {
    if (currentAction !== Actions.SET_CARD) {
      return;
    }
    api.setCard(selectedCard!, number)
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
    dispatch(GameActions.selectBoardCard(card))
  };

  return (
    <div
      className={`h-full bg-emerald-400/50 rounded-md p-1 flex-1 flex flex-col justify-between ${className} ${availabilityClass}`}
      onClick={handleClickLane}
    >
      <div className="justify-center flex">
        {opponentBaseCard !== null && <CardElement card={opponentBaseCard} />}
      </div>

      <div className="mb-1 flex gap-1">
        {opponentCards.map(card => (
          <CardElement card={card} key={card.id} isHidden={isHiddenCard(card) ? true : !(card as Card).isFlipped} />
        ))}
      </div>

      <div className="mt-1 flex gap-1">
        {myCards.map(card => (
          <CardElement card={card} key={card.id} isHidden={!card.isFlipped} onClick={handleClickMyCard(card)} />
        ))}
      </div>
      <div className="justify-center flex">
        {myBaseCard !== null && <CardElement card={myBaseCard} />}
      </div>
    </div>
  );
}

export const LaneSeparator = () => (
  <div className="bg-gray-500/10 w-0.5 mx-1"></div>
);
