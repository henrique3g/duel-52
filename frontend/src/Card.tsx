import { Card, CardType } from './store/StateTypes';
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

type CardProps = {
  card: Card | string;
  isHidden?: boolean;
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

export const CardElement = ({ card, className, isHidden = false }: CardProps) => {
  const [isMouseOverCard, setIsMouseOverCard] = useState(false);
  let cardImage: ReactElement;
  if (typeof card === 'string' || (isHidden && !isMouseOverCard)) {
    cardImage = <img alt='A card face down' src={CardImages.Back} className='w-full h-full' />;
  } else {
    cardImage = <img alt={`A card of playing card of value ${card.cardType}`} src={CardImages[card.cardType]} className='w-full h-full' />;
  }

  function changeOverState(status: boolean) {
    return () => setIsMouseOverCard(status);
  }

  return <div style={{borderWidth: 1}} onMouseOut={changeOverState(false)} onMouseOver={changeOverState(true)} className={`border-gray-700 border-solid w-20 rounded-md overflow-hidden ${className}`}>
    { cardImage }
  </div>;
}

