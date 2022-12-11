import { CardElement } from "./Card";

type StackCardsProps = {
  title: string;
  className?: string;
};

export const StackCards = ({ title, className }: StackCardsProps) => {
  return <div className={`${className}`}>
    <span className="text-sm text-gray-300">{title}</span>
    <CardElement card={'logo-image'} />
    <span className="text-white text-xs">{1} cards</span>
  </div>;
};
