import { useState, useContext } from "react";
import { IGameState, IPlayerState, MyContext } from "../Context";
import { FaChevronDown, FaChevronUp, FaBars, FaTimes } from "react-icons/fa";
import TOKENS from "../constants/tokens";
import { toast } from "react-toastify";
import PROPERTIES from "../constants/properties";
import SellModal from "./SellModal";

const PlayerState = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [isRailroadsOpen, setIsRailroadsOpen] = useState(false);
  const [isMortgagesOpen, setIsMortgagesOpen] = useState(false);
  const [activeSellProperty, setActiveSellProperty] = useState("");

  const {
    name,
    gameState: { playerStates },
    setGameState,
    currentUserId,
    socket,
  } = useContext(MyContext);
  const {
    playerMoney,
    playerProperties,
    playerRailroads,
    playerUtilities,
    playerMortgagedProperties,
    playerToken: token,
  } = playerStates.find(
    (player) => player.id === currentUserId
  ) as IPlayerState;

  // Action Handlers
  const handleSellProperty = (property: string) => {
    setActiveSellProperty(property);
    // socket?.emit(
    //   "list-on-marketplace",
    //   { property },
    //   ({ success, error }: { success?: boolean; error?: string }) => {
    //     if (error) return toast.error(error);
    //     if (success) {
    //       toast.success(`Successfully listed ${property} on the marketplace`);
    //     }
    // }
    // );
    // Add your logic here
  };

  const handleTradeProperty = (property: string) => {
    console.log(`Trading property: ${property}`);
    // Add your logic here
  };

  const handleMortgageProperty = (
    property: string,
    type: "Properties" | "Utilities" | "Railroads"
  ) => {
    socket?.emit(
      "mortgage-property",
      { property, type },
      ({
        success,
        error,
        state,
      }: {
        success?: boolean;
        error?: string;
        state: IGameState;
      }) => {
        if (error) return toast.error(error);
        if (success) {
          setGameState(state);
          toast.success(`Successfully mortgaged ${property}`);
        }
      }
    );
  };

  const handleUnmortgageProperty = (
    property: string,
    type: "Properties" | "Utilities" | "Railroads"
  ) => {
    socket?.emit(
      "unmortgage-property",
      { property, type },
      ({
        success,
        error,
        state,
      }: {
        success?: boolean;
        error?: string;
        state: IGameState;
      }) => {
        if (error) return toast.error(error);
        if (success) {
          setGameState(state);
          toast.success(`Successfully unmortgaged ${property}`);
        }
      }
    );
    // Add your logic here
  };

  return (
    <>
      <SellModal
        open={Boolean(activeSellProperty)}
        property={activeSellProperty}
        handleClose={() => setActiveSellProperty("")}
      />
      <div
        className={`xl:hidden fixed top-5 right-5 p-3 rounded-full ${
          !isMenuOpen && "bg-[#FF9633]"
        } z-[51]`}
      >
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white text-[16px]"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div
        className={`${
          (isMenuOpen && "block") || "hidden"
        } fixed top-0 right-0 w-60 bg-gray-700 text-white h-full shadow-lg z-50 xl:block`}
      >
        <div className="p-4">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold mr-4">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex justify-start items-center gap-3">
                <p className="text-lg font-semibold">{name}</p>
                <img
                  src={TOKENS[token].src}
                  className="h-[5.5vmin] w-[5.5vmin] z-10"
                />
              </div>
              <p className="text-md">${playerMoney}</p>
            </div>
          </div>

          {/* Properties Section */}
          <div className="w-full bg-gray-700 text-white p-4 border-b-2 border-white ">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsPropertiesOpen(!isPropertiesOpen)}
            >
              <h1 className="text-lg">Properties</h1>
              {isPropertiesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isPropertiesOpen && (
              <div>
                {playerProperties.map((property, index) => (
                  <div key={index} className="py-2">
                    <p className="font-bold">{property.name}</p>
                    <p className="text-xs font-base">
                      No. of Houses: {property.numHouses}
                    </p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() => handleSellProperty(property.name)}
                        className="text-red-500 text-sm"
                      >
                        List on Marketplace
                      </button>
                      <button
                        onClick={() => handleTradeProperty(property.name)}
                        className="text-blue-500 text-sm"
                      >
                        Trade
                      </button>
                      <button
                        onClick={() =>
                          handleMortgageProperty(property.name, "Properties")
                        }
                        className="text-yellow-500 text-sm"
                      >
                        Mortgage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Utilities Section */}
          <div className="w-full bg-gray-700 text-white p-4 border-b-2 border-white ">
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
                  No. of Utilities: {playerUtilities.length}
                </p>
                {playerUtilities.map((utility, index) => (
                  <div key={index} className="py-2">
                    <p className="text-xs font-base">{utility}</p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() => handleSellProperty(utility)}
                        className="text-red-500 text-sm"
                      >
                        List on Marketplace
                      </button>
                      <button
                        onClick={() => handleTradeProperty(utility)}
                        className="text-blue-500 text-sm"
                      >
                        Trade
                      </button>
                      <button
                        onClick={() =>
                          handleMortgageProperty(utility, "Utilities")
                        }
                        className="text-yellow-500 text-sm"
                      >
                        Mortgage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Railroads Section */}
          <div className="w-full bg-gray-700 text-white p-4 border-b-2 border-white ">
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
                  No. of Railroads: {playerRailroads.length}
                </p>
                {playerRailroads.map((railroad, index) => (
                  <div key={index} className="py-2">
                    <p className="text-xs font-base">{railroad}</p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() => handleSellProperty(railroad)}
                        className="text-red-500 text-sm"
                      >
                        List on Marketplace
                      </button>
                      <button
                        onClick={() => handleTradeProperty(railroad)}
                        className="text-blue-500 text-sm"
                      >
                        Trade
                      </button>
                      <button
                        onClick={() =>
                          handleMortgageProperty(railroad, "Railroads")
                        }
                        className="text-yellow-500 text-sm"
                      >
                        Mortgage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mortgages Section */}
          <div className="w-full bg-gray-700 text-white rounded-b-lg p-4 ">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setIsMortgagesOpen(!isMortgagesOpen)}
            >
              <h1 className="text-lg">Mortgages</h1>
              {isMortgagesOpen ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {isMortgagesOpen && (
              <div>
                {playerMortgagedProperties.map((property, index) => (
                  <div key={index} className="py-2">
                    <p className="font-bold">{property}</p>
                    <div className="flex gap-2 items-center text-base">
                      <button
                        onClick={() => handleSellProperty(property)}
                        className="text-red-500 text-sm"
                      >
                        List on Marketplace
                      </button>
                      <button
                        onClick={() =>
                          handleUnmortgageProperty(
                            property,
                            PROPERTIES.find((p) => p.Name === property)
                              ?.type === "Property"
                              ? "Properties"
                              : "Utility"
                              ? "Utilities"
                              : "Railroads"
                          )
                        }
                        className="text-green-500 text-sm"
                      >
                        Unmortgage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PlayerState;
