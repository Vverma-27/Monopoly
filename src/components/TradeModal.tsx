import { useContext, useEffect, useState } from "react";
import { IPlayerState, MyContext } from "../Context";
import Modal from "./Modal"; // Import your modal component
import { FaChevronUp, FaChevronDown, FaTimes } from "react-icons/fa";
import CreateTradeOffer from "./CreateTradeOffer";

const TradeModal = () => {
  const {
    gameState: { playerStates },
    name,
    tradeModalOpen,
    setTradeModalOpen,
  } = useContext(MyContext);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [isRailroadsOpen, setIsRailroadsOpen] = useState(false);
  const [activeProperty, setActiveProperty] = useState<{
    name: string;
    type: string;
    owner: string;
  }>({ name: "", type: "", owner: "" });
  //   const [isMortgagesOpen, setIsMortgagesOpen] = useState(false);

  // Filter out the current player
  const filteredPlayers = playerStates.filter((player) => player.name !== name);
  const [activePlayer, setActivePlayer] = useState(
    filteredPlayers[0]?.name || ""
  );
  useEffect(() => {
    setActivePlayer(filteredPlayers[0]?.name || "");
  }, [filteredPlayers]);

  // Get the active player's details
  const activePlayerState = playerStates.find(
    (player) => player.name === activePlayer
  ) as IPlayerState;
  if (filteredPlayers.length === 0) return null;
  const handleTradeOffer = (property: string, type: string) => {
    setActiveProperty({ name: property, type, owner: activePlayerState.id });
  };
  return (
    <Modal isOpen={tradeModalOpen}>
      <>
        <button
          onClick={() => setTradeModalOpen(false)}
          className="float-right"
        >
          <FaTimes />
        </button>
        <div className="p-4">
          {/* Player Names Tabs */}
          <div className="flex justify-between mb-4">
            {filteredPlayers.map((player, index) => (
              <button
                key={index}
                onClick={() => setActivePlayer(player.name)}
                className={`p-2 ${
                  activePlayer === player.name ? "bg-blue-500" : "bg-gray-500"
                } text-white rounded`}
              >
                {player.name}
              </button>
            ))}
          </div>

          {/* Properties Section */}
          <div className="w-full bg-white text-gray-700 p-4 border-b-2 border-white">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            >
              <h1 className="text-lg">Properties</h1>
              {isPropertiesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isPropertiesOpen && (
              <div>
                {activePlayerState.playerProperties.map((property, index) => (
                  <div key={index} className="py-2">
                    <p className="font-bold">{property.name}</p>
                    <p className="text-xs font-base">
                      No. of Houses: {property.numHouses}
                    </p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() =>
                          handleTradeOffer(property.name, "Property")
                        }
                        className="text-red-500 text-sm"
                      >
                        Create Trade Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Utilities Section */}
          <div className="w-full bg-white text-gray-700 p-4 border-b-2 border-white">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsUtilitiesOpen(!isUtilitiesOpen)}
            >
              <h1 className="text-lg">Utilities</h1>
              {isUtilitiesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isUtilitiesOpen && (
              <div>
                <p className="font-bold">
                  No. of Utilities: {activePlayerState.playerUtilities.length}
                </p>
                {activePlayerState.playerUtilities.map((utility, index) => (
                  <div key={index} className="py-2">
                    <p className="text-xs font-base">{utility}</p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() => handleTradeOffer(utility, "Utility")}
                        className="text-red-500 text-sm"
                      >
                        Create Trade Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Railroads Section */}
          <div className="w-full bg-white text-gray-700 p-4 border-b-2 border-white">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsRailroadsOpen(!isRailroadsOpen)}
            >
              <h1 className="text-lg">Railroads</h1>
              {isRailroadsOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isRailroadsOpen && (
              <div>
                <p className="font-bold">
                  No. of Railroads: {activePlayerState.playerRailroads.length}
                </p>
                {activePlayerState.playerRailroads.map((railroad, index) => (
                  <div key={index} className="py-2">
                    <p className="text-xs font-base">{railroad}</p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() => handleTradeOffer(railroad, "Railroad")}
                        className="text-red-500 text-sm"
                      >
                        Create Trade Offer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mortgages Section */}
          {/* <div className="w-full bg-white text-gray-700 rounded-b-lg p-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsMortgagesOpen(!isMortgagesOpen)}
            >
              <h1 className="text-lg">Mortgages</h1>
              {isMortgagesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isMortgagesOpen && (
              <div>
                {activePlayerState.playerMortgagedProperties.map(
                  (property, index) => (
                    <div key={index} className="py-2">
                      <p className="font-bold">{property}</p>
                    </div>
                  )
                )}
              </div>
            )}
          </div> */}
        </div>
        <CreateTradeOffer
          property={activeProperty.name}
          owner={activeProperty.owner}
          handleClose={() =>
            setActiveProperty({ name: "", type: "", owner: "" })
          }
        />
      </>
    </Modal>
  );
};

export default TradeModal;
