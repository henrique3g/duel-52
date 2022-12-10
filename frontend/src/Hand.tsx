import { CardElement } from "./Card";
import { Card as Cardd } from './store/StateTypes';

export type Card = {
  flipped: boolean;
  image: string;
};

type HandProps = {
  cards?: Cardd[],
  handSize?: number,
  className: string,
};

function arrayFromSize(size: number = 0) {
  return Array.from(Array(size), () => 'card-hidden')
}

export const Hand = ({ cards, handSize, className }: HandProps) => {
  const cardsArray = cards ? cards : arrayFromSize(handSize);
  return <div className={`flex justify-center bg-amber-100 p-2 rounded-md ${className}`}>
    { cardsArray.map((card, index) => <CardElement card={card} key={index} className="mr-2" />) }
  </div>
}

