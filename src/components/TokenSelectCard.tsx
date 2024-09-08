const TokenSelectCard = ({
  img,
  name,
  onClick,
  border,
  playerName,
}: {
  img: string;
  name: string;
  onClick: () => void;
  border: string;
  playerName: string;
}) => {
  return (
    <div
      className={`bg-white rounded-lg shadow-none hover:shadow-lg transition-shadow duration-300 p-4 flex flex-col items-center cursor-pointer border-2 ${
        border || "border-transparent"
      } relative`}
      onClick={onClick}
    >
      <p className="text-xs font-bold absolute top-0 left-1 -translate-y-1/2 bg-white px-1">
        {playerName}
      </p>
      <img src={img} alt={name} className="w-20 h-20 mb-2" />
      <p className="font-semibold text-center">{name}</p>
    </div>
  );
};

export default TokenSelectCard;
