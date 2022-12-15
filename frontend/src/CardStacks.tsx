import { CardElement } from "./Card";
import { HiddenCard } from "./store/StateTypes";

type StackCardsProps = {
  title: string;
  quantity: number;
  className?: string;
};

const hiddenCard: HiddenCard = {
  id: 'hidden-card',
  damageReceived: 0,
}

export const StackCards = ({ title, quantity, className }: StackCardsProps) => {
  return <div className={`${className}`}>
    <span className="text-sm text-gray-300">{title}</span>
    <CardElement card={hiddenCard} />
    <span className="text-white text-xs">{quantity} cards</span>
  </div>;
};
