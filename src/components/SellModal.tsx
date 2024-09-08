import React, { useContext, useEffect, useState } from "react";
import Modal from "./Modal";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { Marketplace, MyContext } from "../Context";
import { toast } from "react-toastify";

const SellModal = ({
  open,
  property,
  handleClose,
}: {
  open: boolean;
  property: string;
  handleClose: () => void;
}) => {
  const [askingPrice, setAskingPrice] = useState(0);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [autoSellAbove, setAutoSellAbove] = useState<number | undefined>(
    undefined
  );
  const { setMarketPlace, socket } = useContext(MyContext);

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
  };
  useEffect(() => {
    setAskingPrice(0);
    setAutoSellAbove(undefined);
  }, [property]);
  return (
    <Modal isOpen={open}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Sell Property</h2>
        <p className="text-lg mb-4">Property: {property}</p>

        <label className="font-bold block mb-2" htmlFor="askingPrice">
          Asking Price
        </label>
        <input
          type="number"
          id="askingPrice"
          value={askingPrice}
          onChange={(e) => setAskingPrice(+e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />

        <div
          className="flex items-center cursor-pointer text-blue-600 mb-4"
          onClick={toggleAdvancedOptions}
        >
          {showAdvancedOptions ? <FaChevronUp /> : <FaChevronDown />}
          <span className="ml-2">
            {showAdvancedOptions
              ? "Hide Advanced Options"
              : "Show Advanced Options"}
          </span>
        </div>

        {showAdvancedOptions && (
          <div className="mb-4">
            <label className="font-bold block mb-2" htmlFor="autoSellAbove">
              Automatically Sell Above
            </label>
            <input
              type="number"
              id="autoSellAbove"
              value={autoSellAbove}
              onChange={(e) => setAutoSellAbove(+e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        )}
        <div className="flex gap-2 items-center">
          <button
            className="bg-[#FF9633] py-2 px-7 text-white rounded-md text-sm"
            onClick={() => {
              socket?.emit(
                "list-on-marketplace",
                {
                  property,
                  askingPrice: Number(askingPrice),
                  autoSellAbove: Number(autoSellAbove),
                },
                ({
                  error,
                  success,
                  marketPlace,
                }: {
                  error?: string;
                  success?: string;
                  marketPlace?: Marketplace;
                }) => {
                  if (error) {
                    toast.error(error);
                  }
                  if (success) {
                    setMarketPlace(marketPlace as Marketplace);
                  }
                }
              );
              handleClose();
            }}
          >
            Sell
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

export default SellModal;
