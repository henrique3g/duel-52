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
  const myCards = I.board[number].cards;
  const opponentCards = opponent.board[number].cards;

  return (
    <div className={`h-full bg-emerald-400/50 flex-1 flex flex-col justify-between ${className}`}>
      <div className="justify-center flex">
        {opponentBaseCard !== null && <CardElement card={opponentBaseCard} />}
      </div>

      <div className="mb-1 flex gap-1">
        {opponentCards.map(card => (
          <CardElement card={card} key={typeof card === 'string' ? card : card.id} isHidden={typeof card === 'string' ? true : !card.isFlipped} />
        ))}
      </div>

      <div className="mt-1 flex gap-1">
        {myCards.map(card => (
          <CardElement card={card} key={card.id} isHidden={!card.isFlipped} />
        ))}
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
