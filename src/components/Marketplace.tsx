import { useContext, useState } from "react";
import Modal from "./Modal";
import { MyContext } from "../Context";
import { FaTimes } from "react-icons/fa";
import PROPERTIES from "../constants/properties";
import BuyModal from "./BuyModal";

const Marketplace = () => {
  const {
    marketPlaceOpen,
    setMarketplaceOpen,
    name,
    gameState: { marketPlace },
  } = useContext(MyContext);
  const [activeBuyProperty, setActiveBuyProperty] = useState<{
    name: string;
    askingPrice: number;
    owner: string;
    autoSellAbove?: number;
    ownerSocketId: string;
  } | null>(null);

  return (
    <Modal isOpen={marketPlaceOpen} className="w-[40vw] max-w-[40vw]">
      <>
        {(activeBuyProperty && (
          <BuyModal
            open={Boolean(activeBuyProperty)}
            property={activeBuyProperty}
            handleClose={() => setActiveBuyProperty(null)}
          />
        )) ||
          null}
        <button
          onClick={() => setMarketplaceOpen(false)}
          className="float-right"
        >
          <FaTimes />
        </button>
        <div className="p-4 w-full">
          <h1 className="text-2xl font-bold mb-4">Marketplace</h1>
          <div className="space-y-4">
            {marketPlace.map((property, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-4 bg-gray-100 rounded-lg shadow-md border-l-[15px]"
                style={{
                  borderLeftColor: PROPERTIES.find(
                    (p) => p.Name === property.name
                  )?.color,
                }}
              >
                <div className="flex-1">
                  <h2 className="text-lg font-semibold">{property.name}</h2>
                  <p className="text-sm text-gray-700">
                    Asking Price: ${property.askingPrice}
                  </p>
                  <p className="text-sm text-gray-500">
                    Owned by: {property.owner}
                  </p>
                  {property.autoSellAbove && (
                    <p className="text-xs text-gray-500">
                      Auto Sell Above: ${property.autoSellAbove}
                    </p>
                  )}
                </div>
                <div>
                  <button
                    onClick={() => {
                      if (property.owner === name) {
                        return;
                      }
                      setActiveBuyProperty(property);
                      // socket?.emit("send-buy-offer", {
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                  >
                    {property.owner === name ? "View Offers" : "Send Offer"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    </Modal>
  );
};

export default Marketplace;
