import { useContext, useState } from "react";
import Modal from "./Modal";
import TOKENS from "../constants/tokens";
import TokenSelectCard from "./TokenSelectCard";
import { MyContext, PlayerToken } from "../Context";
import { useNavigate } from "react-router-dom";
import COLORS from "../constants/colors";

const TokenSelect = () => {
  const {
    gameState: { gameId, playerStates, active, host },
    currentUserId,
    socket,
    setToken,
  } = useContext(MyContext);
  // const { playerToken: token } = playerStates.find(
  //   (player) => player.id === currentUserId
  // ) as IPlayerState;
  const [text, setText] = useState("Copy");
  // const [selected, setSelected] = useState<PlayerToken>(PlayerToken.NA);
  //   console.log("🚀 ~ TokenSelect ~ token:", token);
  const navigate = useNavigate();
  return (
    <Modal isOpen={!active} className="max-h-[80%]">
      <>
        <div className="fixed top-5 right-5  p-3 bg-white rounded-lg">
          <p className="text-xs font-black">Game Code</p>
          <p className="text-sm font-base mb-4">{gameId}</p>
          <p className="text-xs font-black">Game URL</p>
          <p className="text-sm font-base mb-4">
            {`${window.location.host}/join?gameID=${gameId}`.slice(0, 30)}...
          </p>
          <div className="flex gap-3">
            <button
              className="text-xs border-green-500 border-2 px-3 py-2 rounded-md"
              onClick={async () => {
                await navigator.clipboard.writeText(
                  `${window.location.host}/join?gameID=${gameId}`
                );
                setText("Copied");
              }}
            >
              {text}
            </button>
            <button
              className="text-xs border-red-600 border-2 px-3 py-2 rounded-md"
              onClick={() => {
                socket?.emit(
                  "cancel-game",
                  gameId,
                  ({ success }: { success: boolean }) => {
                    if (success) {
                      navigate("/");
                    }
                  }
                );
              }}
            >
              Cancel
            </button>
          </div>
        </div>
        <h1 className="text-center font-bold text-lg w-full">
          Choose Your Token
        </h1>
        <div className="flex flex-wrap gap-3 justify-around">
          {Object.keys(TOKENS)
            .filter((token) => token !== PlayerToken.NA)
            .map((token) => {
              const tokenData = TOKENS[token as keyof typeof TOKENS];
              const playerIndex = playerStates
                .map((ps) => ps.playerToken)
                .findIndex((t) => t === token);
              return (
                <TokenSelectCard
                  key={token}
                  img={tokenData.src}
                  playerName={playerStates[playerIndex]?.name}
                  border={COLORS[playerIndex]}
                  name={tokenData.name}
                  onClick={() => {
                    socket?.emit("token-select", token);
                    setToken(token as keyof typeof TOKENS, currentUserId);
                  }}
                />
              );
            })}
        </div>
        {host === currentUserId ? (
          <button
            className="mt-4 float-right px-3 py-2 rounded-md bg-[#FF9633] text-white"
            onClick={() => {
              socket?.emit("start-game");
            }}
          >
            Start Game
          </button>
        ) : null}
      </>
    </Modal>
  );
};

export default TokenSelect;
