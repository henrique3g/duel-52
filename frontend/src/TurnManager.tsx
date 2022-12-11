import { useAppSelector } from "./store";

type TurnManagerProps = {
  className?: string;
};

export const TurnManager = ({ className }: TurnManagerProps) => {
  const { turnInfo } = useAppSelector((state) => state.game.gameState);

  return <div className={`bg-blue-500 text-white rounded px-2 py-1 ${className}`}>
    <div>
      <span className="font-normal text-xs">Actions: </span>
      <span className="font-semibold">{turnInfo.remainingActions}</span>
    </div>
    <div>
      <span className="font-normal text-xs">Current player: </span>
      <span className="">{turnInfo.isMyTurn ? 'You' : 'Opponent'}</span>
    </div>
  </div>;
};
