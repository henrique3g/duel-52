import { CardElement } from "./Card";
import { useAppSelector } from "./store";

type LaneProps = {
  number: number;
  className?: string;
};

export const Lane = ({ number, className }: LaneProps) => {
  const { I, opponent } = useAppSelector(state => state.game.gameState);
  const myBaseCard = I.board[number].baseCard;
  const opponentBaseCard = opponent.board[number].baseCard;

  return (
    <div className={`h-full bg-emerald-400/50 flex-1 flex flex-col justify-between ${className}`}>
      <div className="justify-center flex">
        {opponentBaseCard !== null && <CardElement card={opponentBaseCard} />}
      </div>



      <div className="justify-center flex">
        {myBaseCard !== null && <CardElement card={myBaseCard} />}
      </div>
    </div>
  );
}

export const LaneSeparator = () => (
  <div className="bg-gray-500/10 w-0.5 mx-1"></div>
);
