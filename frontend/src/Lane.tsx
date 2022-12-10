type LaneProps = {
  className?: string;
};

export const Lane = ({className}: LaneProps) => {
  return <div className={`h-full bg-emerald-400/90 flex-1 ${className}`}></div>;
}

export const LaneSeparator = () => (
  <div className="bg-gray-500/10 w-0.5 mx-1"></div>
);
