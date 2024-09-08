import { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { MyContext } from "../Context";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";

const BuyModal = ({
  open,
  property,
  handleClose,
}: {
  open: boolean;
  property: {
    name: string;
    askingPrice: number;
    owner: string;
    autoSellAbove?: number;
    ownerSocketId: string;
  };
  handleClose: () => void;
}) => {
  const [offerPrice, setOfferPrice] = useState(0);
  const { socket } = useContext(MyContext);

  useEffect(() => {
    setOfferPrice(0);
  }, [property]);
  return (
    <Modal isOpen={open}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Sell Property</h2>
        <p className="text-lg mb-4">Property: {property.name}</p>

        <label className="font-bold block mb-2" htmlFor="offerPrice">
          Offer Price
        </label>
        <input
          type="number"
          id="offerPrice"
          value={offerPrice}
          onChange={(e) => setOfferPrice(+e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <div className="flex gap-2 items-center">
          <button
            className="bg-[#FF9633] py-2 px-7 text-white rounded-md text-sm"
            onClick={() => {
              socket?.emit(
                "send-buy-offer",
                {
                  property: property.name,
                  offerPrice: Number(offerPrice),
                  to: property.ownerSocketId,
                },
                ({ error, success }: { error?: string; success?: string }) => {
                  if (error) {
                    toast.error(error);
                  }
                  if (success) {
                    toast.success(
                      "Offer sent successfully",
                      ClosableToastConfig
                    );
                  }
                }
              );
              handleClose();
            }}
          >
            Send Offer
          </button>

          <button
            className="border border-[#FF9633] py-2 px-7 text-black rounded-md text-sm"
            onClick={() => {
              handleClose();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BuyModal;
