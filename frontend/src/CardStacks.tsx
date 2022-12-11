import { CardElement } from "./Card";

type StackCardsProps = {
  title: string;
  quantity: number;
  className?: string;
};

export const StackCards = ({ title, quantity, className }: StackCardsProps) => {
  return <div className={`${className}`}>
    <span className="text-sm text-gray-300">{title}</span>
    <CardElement card={'logo-image'} />
    <span className="text-white text-xs">{quantity} cards</span>
  </div>;
};
