import { CardElement } from "./Card";
import { Card } from './store/StateTypes';


type HandProps = {
  cards?: Card[],
  handSize?: number,
  className: string,
};

function arrayFromSize(size: number = 0) {
  return Array.from(Array(size), () => ({ id: 'hidden-card', damageReceived: 0 }));
}

export const Hand = ({ cards, handSize, className }: HandProps) => {
  const cardsArray = cards ? cards : arrayFromSize(handSize);
  return <div className={`flex justify-center bg-amber-100 p-2 rounded-md ${className}`}>
    {cardsArray.map((card, index) => <CardElement card={card} key={index} className="mr-2" />)}
  </div>
}

