import { useContext, useEffect, useState } from "react";
import { MyContext, Offer } from "../Context";
import { FaBell } from "react-icons/fa";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";
import Modal from "./Modal";

const TradeOfferDisplay = ({
  offer,
  onRejectOffer,
  onAcceptOffer,
  handleClose,
}: {
  offer: Offer | null;
  onAcceptOffer: (id: string, message: string, type: string) => void;
  onRejectOffer: (id: string, message: string, type: string) => void;
  handleClose: () => void;
}) => {
  const tradeOffer = offer as Extract<Offer, { type: "trade" }>;
  if (!offer) return;
  return (
    <Modal isOpen={Boolean(offer)}>
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Trade Offer</h2>
        <p className="text-lg mb-4">Property: {tradeOffer.property}</p>
        <p className="text-lg mb-4">From: {tradeOffer.from}</p>
        <div className="text-lg mb-4">
          Offer:
          <br />
          {Object.keys(tradeOffer.offer).map((key) => {
            if (key === "money") {
              return (
                <div key={key} className="text-sm mb-2">
                  <span className="font-bold">Money:</span> $
                  {tradeOffer.offer[key]}
                </div>
              );
            }

            return (
              <div key={key} className="text-sm mb-2">
                <span className="font-bold">
                  {key[0].toUpperCase() + key.slice(1)}:
                </span>
                {
                  //@ts-ignore
                  tradeOffer.offer[key as keyof typeof tradeOffer.offer].map(
                    (item: any) => (
                      <div key={item.name}>
                        {item.name}: ${item.price} (price)
                      </div>
                    )
                  )
                }
              </div>
            );
          })}
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="bg-[#FF9633] py-2 px-7 text-white rounded-md text-sm"
            onClick={() => {
              onAcceptOffer(
                tradeOffer.id as string,
                `Successfully accepted ${tradeOffer.from}'s offer for ${tradeOffer.property}`,
                "trade"
              );
              handleClose();
            }}
          >
            Accept
          </button>
          <button
            className="border border-[#FF9633] py-2 px-7 text-black rounded-md text-sm"
            onClick={() => {
              onRejectOffer(
                tradeOffer.id as string,
                `You rejected ${tradeOffer.from}'s offer for ${tradeOffer.property}`,
                "trade"
              );
              handleClose();
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </Modal>
  );
};

const Notifications = () => {
  const { offers, offerNotifs, setOfferNotifs, setOffers, socket } =
    useContext(MyContext);
  const [activeOffer, setActiveOffer] = useState<Offer | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) setOfferNotifs(0);
  }, [isOpen, offerNotifs]);
  const onAcceptOffer = (id: string, message: string, type: string) => {
    socket?.emit(
      `accept-${type}-offer`,
      id,
      ({
        error,
        success,
        offers,
      }: {
        error?: string;
        success?: string;
        offers?: Offer[];
      }) => {
        if (error) {
          toast.error(error, ClosableToastConfig);
        }
        if (success) {
          setOffers(offers as Offer[]);
          toast.success(message, ClosableToastConfig);
        }
      }
    );
  };
  const onRejectOffer = (id: string, message: string, type: string) => {
    socket?.emit(
      `reject-${type}-offer`,
      id,
      ({
        error,
        success,
        offers,
      }: {
        error?: string;
        success?: string;
        offers?: Offer[];
      }) => {
        if (error) {
          toast.error(error, ClosableToastConfig);
        }
        if (success) {
          setOffers(offers as Offer[]);
          toast.success(message, ClosableToastConfig);
        }
      }
    );
  };

  return (
    <div className="fixed top-5 xs:right-20 right-24">
      {offerNotifs > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {offerNotifs}
        </div>
      )}
      <button
        className=" p-3 rounded-full bg-[#FF9633] z-10"
        onClick={() => setIsOpen(!isOpen)}
      >
        <FaBell className="text-white text-[16px]" />
      </button>
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 shadow-lg rounded-md p-4 z-20"
          //   style={{ transform: "translateY(40px)" }}
        >
          <div className="relative">
            <div
              className="absolute -top-4 right-0 w-4 h-4 bg-white border-l border-t border-gray-300"
              style={{
                transform: "rotate(45deg) translateY(-50%)",
              }}
            />
          </div>
          <h3 className="text-lg font-bold mb-2">Notifications</h3>
          {offers.length > 0 ? (
            offers.map((offer, index) => (
              <>
                <div key={index} className="mb-2 w-full flex justify-between">
                  <div>
                    <p>{`${offer.from} made an offer for ${offer.property}`}</p>
                    {offer.type === "buy" ? (
                      <p className="text-sm text-gray-500">{`Price: $${offer.offerPrice}`}</p>
                    ) : null}
                  </div>
                  {offer.type === "buy" ? (
                    <div>
                      <p
                        className="text-sm text-green-400 cursor-pointer"
                        onClick={() =>
                          onAcceptOffer(
                            offer.id,
                            `Successfully sold ${offer.property} to ${offer.from} for ${offer.offerPrice}`,
                            "buy"
                          )
                        }
                      >
                        Accept
                      </p>
                      <p
                        className="text-sm text-red-400 cursor-pointer"
                        onClick={() =>
                          onRejectOffer(
                            offer.id,
                            `You rejected ${offer.from}'s offer for ${offer.property} at $${offer.offerPrice}`,
                            "buy"
                          )
                        }
                      >
                        Reject
                      </p>
                    </div>
                  ) : (
                    <button
                      className="bg-[#FF9633] px-2 py-1 text-xs text-white rounded-md"
                      onClick={() => setActiveOffer(offer)}
                    >
                      View Offer
                    </button>
                  )}
                </div>
                <hr />
              </>
            ))
          ) : (
            <p>No offers yet.</p>
          )}
        </div>
      )}
      <TradeOfferDisplay
        offer={activeOffer}
        onAcceptOffer={onAcceptOffer}
        onRejectOffer={onRejectOffer}
        handleClose={() => setActiveOffer(null)}
      />
    </div>
  );
};

export default Notifications;
