import { CardElement } from "./Card";
import { useAppSelector } from "./store";

type LaneProps = {
  number: number;
  className?: string;
};

export const Lane = ({ number, className }: LaneProps) => {
  const { I } = useAppSelector(state => state.game.gameState);
  const baseCard = I.board[number].baseCard;
  return <div className={`h-full bg-emerald-400/90 flex-1 flex flex-col justify-between ${className}`}>
    <div className="justify-center flex">
      {baseCard !== null && <CardElement card={baseCard} />}
    </div>

    <div className="justify-center flex">
      {baseCard !== null && <CardElement card={baseCard} />}
    </div>
  </div>;
}

export const LaneSeparator = () => (
  <div className="bg-gray-500/10 w-0.5 mx-1"></div>
);
