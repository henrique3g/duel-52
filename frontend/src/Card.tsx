import { Card, CardType, HiddenCard } from './store/StateTypes';
import Back from './svg/back.svg';
import A from './svg/a.svg';
import Two from './svg/2.svg';
import Three from './svg/3.svg';
import Four from './svg/4.svg';
import Five from './svg/5.svg';
import Six from './svg/6.svg';
import Seven from './svg/7.svg';
import Eight from './svg/8.svg';
import Nine from './svg/9.svg';
import Ten from './svg/10.svg';
import J from './svg/j.svg';
import Q from './svg/q.svg';
import K from './svg/k.svg';
import { ReactElement, useState } from 'react';
import { useAppSelector } from './store';

type CardProps = {
  card: Card | HiddenCard;
  isHidden?: boolean;
  onClick?: () => void;
  className?: string;
};

const CardImages = {
  Back,
  [CardType.A]: A,
  [CardType.Two]: Two,
  [CardType.Three]: Three,
  [CardType.Four]: Four,
  [CardType.Five]: Five,
  [CardType.Six]: Six,
  [CardType.Seven]: Seven,
  [CardType.Eight]: Eight,
  [CardType.Nine]: Nine,
  [CardType.Ten]: Ten,
  [CardType.J]: J,
  [CardType.Q]: Q,
  [CardType.K]: K,
};

export function isHiddenCard(card: Card | HiddenCard): boolean {
  return !Object.hasOwn(card, 'cardType');
}

export const CardElement = ({ card, onClick, className, isHidden = false }: CardProps) => {
  const { selectedCard } = useAppSelector(state => state.game);
  const [isMouseOverCard, setIsMouseOverCard] = useState(false);
  let cardImage: ReactElement;
  if (isHiddenCard(card) || (isHidden && !isMouseOverCard)) {
    cardImage = <img alt='A card face down' src={CardImages.Back} className='w-full h-full' />;
  } else {
    const localCard = card as Card;
    cardImage = <img alt={`A card of playing card of value ${localCard.cardType}`} src={CardImages[localCard.cardType]} className='w-full h-full' />;
  }

  function changeOverState(status: boolean) {
    return () => setIsMouseOverCard(status);
  }

  let rotateClass = card.damageReceived >= 1 ? '-rotate-90' : '';
  if (!isHiddenCard(card) && (card as Card).cardType === CardType.J && card.damageReceived === 0 && (card as Card).isFlipped) {
    rotateClass = '-rotate-45';
  }

  return <div
    onMouseOut={changeOverState(false)}
    onMouseOver={changeOverState(true)}
    onClick={onClick}
    className={`border-gray-700 border-solid w-20 rounded-md overflow-hidden ${rotateClass} ${className} ${selectedCard === card.id ? 'border-blue-500 border-[3px]' : 'border-[1px]'}`}
  >
    {cardImage}
  </div>;
}

