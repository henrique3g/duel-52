import { useAppSelector } from "./store";

type TurnManagerProps = {
  className?: string;
};

export const TurnManager = ({className}: TurnManagerProps) => {
  const { remainingActions } = useAppSelector((state) => state.game.round);

  return <div className={`relative rounded-full bg-red-300/70 p-7 ${className}`}>
    <div className="absolute inset-0 flex justify-center items-start">
      <span className="text-white font-semibold mt-2">Actions</span>
    </div>
    <div className="text-white font-semibold w-7 h-7">{remainingActions}</div>
  </div>;
};
