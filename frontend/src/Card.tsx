import { Card } from './Hand';
import Back from './svg/back.svg';

type CardProps = {
  card: Card | null;
  className?: string;
};

export const CardElement = ({ card, className }: CardProps) => {
  return <div className={ `border-gray-500 border-solid border-2 w-20 rounded-md ${className}` }>
    { !card && <img src={Back} className='w-full h-full' /> }
    { card && <img src={card.image} className='w-full h-full' />}
  </div>;
}
