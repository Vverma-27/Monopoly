import { useContext, useState } from "react";
import Modal from "./Modal";
import { IPlayerState, MyContext } from "../Context";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";

const CreateTradeOffer = ({
  property,
  owner,
  handleClose,
}: {
  property: string;
  owner: string;
  handleClose: () => void;
}) => {
  const {
    gameState: { playerStates },
    socket,
  } = useContext(MyContext);
  const currentPlayer = playerStates.find(
    (player) => player.id === socket?.id
  ) as IPlayerState;

  const [isPropertiesOpen, setIsPropertiesOpen] = useState(false);
  const [isUtilitiesOpen, setIsUtilitiesOpen] = useState(false);
  const [isRailroadsOpen, setIsRailroadsOpen] = useState(false);
  const [offer, setOffer] = useState<{
    properties: Array<string>;
    railroads: Array<string>;
    utilities: Array<string>;
    money: number;
  }>({ properties: [], railroads: [], utilities: [], money: 0 });

  const handleTradeOffer = () => {
    socket?.emit(
      "trade-offer-sent",
      {
        to: owner,
        offer,
        property,
      },
      (response: { error?: string; success?: string }) => {
        if (response.error) {
          toast.error(response.error, ClosableToastConfig);
        }
        if (response.success) {
          toast.success("Sent offer", ClosableToastConfig);
          handleClose();
        }
      }
    );
  };

  const handleCheckboxChange = (
    type: "properties" | "utilities" | "railroads",
    value: string,
    checked: boolean
  ) => {
    setOffer((prevOffer) => {
      const newArray = checked
        ? [...prevOffer[type], value]
        : prevOffer[type].filter((item) => item !== value);
      return {
        ...prevOffer,
        [type]: newArray,
      };
    });
  };

  return (
    <Modal isOpen={Boolean(property)}>
      <>
        <h1 className="font-bold">Property to trade: {property}</h1>
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
              {currentPlayer.playerProperties.map((property, index) => (
                <div
                  key={index}
                  className="py-2 flex justify-start gap-6 items-center"
                >
                  <input
                    type="checkbox"
                    checked={offer.properties.includes(property.name)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "properties",
                        property.name,
                        e.target.checked
                      )
                    }
                  />
                  <div>
                    <p className="font-bold">{property.name}</p>
                    <p className="text-xs font-base">
                      No. of Houses: {property.numHouses}
                    </p>
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
                No. of Utilities: {currentPlayer.playerUtilities.length}
              </p>
              {currentPlayer.playerUtilities.map((utility, index) => (
                <div key={index} className="py-2">
                  <input
                    type="checkbox"
                    checked={offer.utilities.includes(utility)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "utilities",
                        utility,
                        e.target.checked
                      )
                    }
                  />
                  <p className="text-xs font-base">{utility}</p>
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
                No. of Railroads: {currentPlayer.playerRailroads.length}
              </p>
              {currentPlayer.playerRailroads.map((railroad, index) => (
                <div key={index} className="py-2">
                  <input
                    type="checkbox"
                    checked={offer.railroads.includes(railroad)}
                    onChange={(e) =>
                      handleCheckboxChange(
                        "railroads",
                        railroad,
                        e.target.checked
                      )
                    }
                  />
                  <p className="text-xs font-base">{railroad}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full bg-white text-gray-700 p-4 border-b-2 border-white">
          <h1 className="text-lg">
            <label className="font-bold block mb-2" htmlFor="offerPrice">
              Money
            </label>
          </h1>
          <input
            type="number"
            id="offerPrice"
            value={offer.money}
            onChange={(e) =>
              setOffer((prev) => ({ ...prev, money: +e.target.value }))
            }
            className="w-full p-2 border border-gray-300 rounded mb-4"
          />
        </div>
        <div className="flex gap-2 items-center text-base">
          <button
            className="bg-[#FF9633] py-2 px-4 text-white rounded-lg text-sm mt-4"
            onClick={() => {
              handleTradeOffer();
            }}
          >
            Send Offer
          </button>
          <button
            className="border border-[#FF9633] py-2 px-4 text-black rounded-lg text-sm mt-4"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </button>
        </div>
      </>
    </Modal>
  );
};

export default CreateTradeOffer;
