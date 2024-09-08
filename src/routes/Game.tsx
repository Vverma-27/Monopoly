import TokenSelect from "../components/TokenSelect";
import MonopolyBoard from "../components/Board";
import PlayerState from "../components/PlayerState";
import PropertyModal from "../components/PropertyModal";
import { useContext, useEffect } from "react";
import { DEFAULT_STATE, IPlayerState, MyContext } from "../Context";
import { useNavigate } from "react-router-dom";
import Marketplace from "../components/Marketplace";
import { FaCartShopping } from "react-icons/fa6";
import Notifications from "../components/Notifications";
import { IoIosSwap } from "react-icons/io";
import TradeModal from "../components/TradeModal";
import AuctionModal from "../components/AuctionModal";

const Game = () => {
  const {
    name,
    gameState: { playerStates, gameId, currTurn },
    currentUserId,
    setGameState,
    setMarketNotifs,
    setTradeNotifs,
    marketNotifs,
    setMarketplaceOpen,
    setTradeModalOpen,
    socket,
  } = useContext(MyContext);
  const navigate = useNavigate();
  useEffect(() => {
    socket?.on("game-cancel", () => {
      setGameState(DEFAULT_STATE);
      navigate("/");
    });
  }, []);
  useEffect(() => {
    if (!gameId) {
      navigate("/");
    }
  }, [gameId]);
  if (!gameId) return null;
  const { playerToken: token } = playerStates.find(
    (player) => player.id === currentUserId
  ) as IPlayerState;
  return (
    <>
      {name && token ? (
        <div className="fixed top-5 left-5 z-10">
          {marketNotifs > 0 && (
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {marketNotifs}
            </div>
          )}
          <div className="p-3 rounded-full bg-[#FF9633]">
            <button
              onClick={() => {
                setMarketplaceOpen(true);
                setMarketNotifs(0);
              }}
              className="text-white text-[16px]"
            >
              <FaCartShopping />
            </button>
          </div>
          <div className="p-3 mt-3 rounded-full bg-[#FF9633]">
            <button
              onClick={() => {
                setTradeModalOpen(true);
                setTradeNotifs(0);
              }}
              className="text-white text-[16px]"
            >
              <IoIosSwap />
            </button>
          </div>
        </div>
      ) : null}

      {name ? (
        <div className="z-[52]">
          <TokenSelect />
        </div>
      ) : null}
      <MonopolyBoard />
      <Marketplace />
      <AuctionModal />
      <TradeModal />
      {currTurn === currentUserId ? <PropertyModal /> : null}
      {name && token ? (
        // <div className="w-80 absolute top-4 right-4 flex flex-col items-start">
        <>
          <Notifications />
          <PlayerState />
        </>
      ) : // </div>
      null}
    </>
  );
};

export default Game;
