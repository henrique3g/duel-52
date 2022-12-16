import { CardElement, isHiddenCard } from "./Card";
import { canClickHandCardSelector, GameActions, useAppDispatch, useAppSelector } from "./store";
import { Card, HiddenCard } from './store/StateTypes';


type HandProps = {
  cards?: Card[],
  handSize?: number,
  className: string,
};

function arrayFromSize(size: number = 0) {
  return Array.from(Array(size), () => ({ id: 'hidden-card', damageReceived: 0 }));
}

export const Hand = ({ cards, handSize, className }: HandProps) => {
  const dispatch = useAppDispatch();
  const canClickHandCard = useAppSelector(canClickHandCardSelector);
  const cardsArray = cards ? cards : arrayFromSize(handSize);
  const handleClick = (cardOrHiddenCard: Card | HiddenCard) => () => {
    if (isHiddenCard(cardOrHiddenCard) || !canClickHandCard) {
      return;
    }
    const card = cardOrHiddenCard as Card;
    dispatch(GameActions.selectHandCard(card));
  };

  return <div className={`flex justify-center bg-amber-100 p-2 rounded-md ${className}`}>
    {cardsArray.map((card, index) => <CardElement card={card} key={index} className="mr-2" onClick={handleClick(card)} />)}
  </div>
}

