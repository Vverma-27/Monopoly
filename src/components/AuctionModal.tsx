import { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context";
import Modal from "./Modal";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";

const AuctionModal = () => {
  const {
    gameState: { playerStates, currentAuction },
    socket,
    setAuction,
    name,
  } = useContext(MyContext);
  const [bid, setBid] = useState(0);
  useEffect(() => {
    if (socket) {
      socket.on("auction", ({ auction }) => {
        setAuction(auction);
      });
      socket.on(
        "auction-end",
        ({
          winner,
          property,
          price,
        }: {
          winner: string;
          property: string;
          price: number;
        }) => {
          toast.success(
            `${
              winner === name ? "You" : winner
            } won the auction for ${property} at $${price}`,
            ClosableToastConfig
          );
          setAuction({
            property: { name: "", price: 0 },
            bids: [],
            currTurn: "",
          });
        }
      );
      return () => {
        socket.off("auction");
        socket.off("auction-end");
      };
    }
  }, [socket]);

  const handleSendBid = (bid: number) => {
    socket?.emit("send-bid", { bid }, ({ error }: { error?: string }) => {
      if (error) {
        toast.error(error, ClosableToastConfig);
        return;
      }
    });
  };

  const handleStand = () => {
    socket?.emit("player-stand");
  };

  return (
    <Modal isOpen={Boolean(currentAuction.property.name)}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Auction</h2>
        <p className="text-lg mb-2">Property: {currentAuction.property.name}</p>
        <p className="text-lg mb-4">Price: ${currentAuction.property.price}</p>

        <div className="mb-4">
          {playerStates.map((player, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{player.name}</span>
              <span>
                {currentAuction.bids[index] === "out"
                  ? "Out"
                  : `${
                      currentAuction.bids[index]
                        ? "$" + currentAuction.bids[index]
                        : "Yet to bid"
                    }`}
              </span>
            </div>
          ))}
        </div>

        {currentAuction.currTurn === name && (
          <div className="flex gap-2 items-center">
            <input
              type="number"
              className="border border-gray-300 rounded p-2"
              min={currentAuction.property.price}
              value={bid}
              placeholder="Enter your bid"
              onChange={(e) => setBid(+e.target.value)}
            />
            <button
              className="bg-green-500 text-white py-2 px-4 rounded"
              onClick={() => handleSendBid(bid)}
            >
              Bid
            </button>
            <button
              className="bg-red-500 text-white py-2 px-4 rounded"
              onClick={handleStand}
            >
              Stand
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AuctionModal;
