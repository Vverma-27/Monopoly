import { useContext, useEffect, useState } from "react";
import { MyContext } from "../Context";

const ShowTradeOffer = () => {
  const { socket } = useContext(MyContext);
  const [_tradeOffers, setTradeOffers] = useState<
    Array<{
      from: string;
      fromSocketId: string;
      property: string;
      offer: {
        properties: Array<{ name: string; price: number }>;
        railroads: Array<{ name: string; price: number }>;
        utilities: Array<{ name: string; price: number }>;
        money: number;
      };
    }>
  >([]);
  useEffect(() => {
    socket?.on("trade-offer-received", (tradeOffer) => {
      setTradeOffers((prevTradeOffers) => [...prevTradeOffers, tradeOffer]);
    });
    return () => {
      socket?.off("trade-offer-received");
    };
  }, []);
  return <></>;
};

export default ShowTradeOffer;
