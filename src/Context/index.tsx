import {
  useMemo,
  useState,
  useEffect,
  createContext,
  Dispatch,
  SetStateAction,
} from "react";
import { DEFAULT_POSITIONS_STATE } from "../constants/properties";
import { Socket } from "socket.io-client";

export enum PlayerToken {
  NA = "",
  CAT = "CAT",
  THIMBLE = "THIMBLE",
  WHEELBARROW = "WHEELBARROW",
  DOG = "DOG",
  TOP_HAT = "TOP_HAT",
}

export interface IPlayerState {
  name: string;
  id: string;
  playerCurrPosition: number;
  playerMoney: number;
  playerProperties: Array<{ name: string; numHouses: number; Hotel: boolean }>;
  playerUtilities: Array<string>;
  playerRailroads: Array<string>;
  playerMortgagedProperties: Array<string>;
  inJail: boolean;
  turnsInJail: number;
  playerToken: PlayerToken;
}

export type Marketplace = Array<{
  name: string;
  askingPrice: number;
  owner: string;
  autoSellAbove?: number;
  ownerSocketId: string;
}>;

export interface IAuction {
  property: { name: string; price: number };
  bids: (number | "out")[];
  currTurn: string;
}

export interface IGameState {
  active: boolean;
  gameId: string;
  activeProperty: string | null;
  playerStates: IPlayerState[];
  marketPlace: Marketplace;
  // auctionProperty: string;
  currentAuction: IAuction;
  currTurn: string;
  host: string;
  propertyStates: {
    [name: string]: {
      ownedBy: string;
      numHouses?: number;
      Hotel?: boolean;
      mortgaged: boolean;
    };
  };
}

export const DEFAULT_STATE: IGameState = {
  active: false,
  currTurn: "",
  gameId: "",
  marketPlace: [],
  currentAuction: {
    property: {
      name: "",
      price: 0,
    },
    bids: [],
    currTurn: "",
  },
  //   playerCurrPosition: 0,
  //   playerMoney: 2000,
  //   playerProperties: [],
  //   playerUtilities: [],
  //   playerRailroads: [],
  //   playerMortgagedProperties: [],
  //   playerTurn: true,
  playerStates: [],
  host: "",
  activeProperty: null,
  propertyStates: DEFAULT_POSITIONS_STATE,
  //   inJail: false,
  //   turnsInJail: 0,
};

// const DEFAULT_STATE: IGameState = {
//   active: true,
//   playerCurrPosition: 0,
//   playerMoney: 2000,
//   playerProperties: [],
//   playerUtilities: [],
//   playerRailroads: [],
//   playerMortgagedProperties: [],
//   playerTurn: true,
//   activeProperty: null,
//   propertyStates: DEFAULT_POSITIONS_STATE,
//   inJail: false,
//   turnsInJail: 0,
// };
export type Offer = (
  | {
      type: "buy";
      offerPrice: number;
    }
  | {
      type: "trade";
      offer: {
        properties: Array<{ name: string; price: number }>;
        railroads: Array<{ name: string; price: number }>;
        utilities: Array<{ name: string; price: number }>;
        money: number;
      };
    }
) & {
  from: string;
  property: string;
  id: string;
};
// interface IMyContext {
//   name: string;
//   // token: string;
//   rolling: boolean;
//   currentUserId: string;
//   offers: Array<Offer>;
//   tradeModalOpen: boolean;
//   setTradeModalOpen: (open: boolean) => void;
//   setCurrentUserId: (id: string) => void;
//   gameState: IGameState;
//   offerNotifs: number;
//   setOfferNotifs: (n: number) => void;
//   marketPlaceOpen: boolean;
//   setMarketplaceOpen: (_open: boolean) => void;
//   setMarketPlace: (marketPlace: Marketplace) => void;
//   setName: (name: string) => void;
//   // setToken: (token: string) => void;
//   setRolling: (rolling: boolean) => void;
//   setToken: (token: PlayerToken, id: string) => void;
//   setGameState: (gameState: IGameState) => void;
//   onNewPlayerJoin: (player: IPlayerState) => void;
//   // diceRoll: (roll: number) => void;
//   // setActiveProperty: (property: string) => void;
//   // buyProperty: (property: string, type: string) => void;
//   // payRent: (rent: number) => void;
//   // buildHouse: (property: string) => void;
//   socket: Socket | null;
//   setSocket: (socket: Socket) => void;
//   onPlayerLeave: (id: string) => void;
//   setOffers: (offers: Array<Offer>) => void;
//   marketNotifs: number;
//   setMarketNotifs: (n: number) => void;
//   randomNumber: number;
//   waiting: boolean;
//   setActiveProperty: (p: string) => void;
//   tradeNotifs: number;
//   setTradeNotifs: (_n: number) => void;
//   setWaiting: (waiting: boolean) => void;
//   setRandomNumber: (randomNumber: number) => void;
// }
interface IMyContext {
  name: string;
  rolling: boolean;
  currentUserId: string;
  offers: Array<Offer>;
  tradeModalOpen: boolean;
  marketPlaceOpen: boolean;
  offerNotifs: number;
  marketNotifs: number;
  randomNumber: number;
  waiting: boolean;
  tradeNotifs: number;
  gameState: IGameState;
  socket: Socket | null;

  setName: Dispatch<SetStateAction<string>>;
  setRolling: Dispatch<SetStateAction<boolean>>;
  setCurrentUserId: Dispatch<SetStateAction<string>>;
  setAuction: (auction: IAuction) => void;
  setOffers: Dispatch<SetStateAction<Array<Offer>>>;
  setTradeModalOpen: Dispatch<SetStateAction<boolean>>;
  setMarketplaceOpen: Dispatch<SetStateAction<boolean>>;
  setOfferNotifs: Dispatch<SetStateAction<number>>;
  setMarketNotifs: Dispatch<SetStateAction<number>>;
  setRandomNumber: Dispatch<SetStateAction<number>>;
  setWaiting: Dispatch<SetStateAction<boolean>>;
  setTradeNotifs: Dispatch<SetStateAction<number>>;
  setGameState: Dispatch<SetStateAction<IGameState>>;
  setSocket: Dispatch<SetStateAction<Socket | null>>;
  setMarketPlace: (marketPlace: Marketplace) => void;
  setToken: (token: PlayerToken, id: string) => void;
  setActiveProperty: (p: string) => void;

  onNewPlayerJoin: (player: IPlayerState) => void;
  onPlayerLeave: (id: string) => void;
}

// export const MyContext = createContext<IMyContext>({
//   name: "",
//   // token: "",
//   rolling: false,
//   randomNumber: 0,
//   waiting: false,
//   marketPlaceOpen: false,
//   offerNotifs: 0,
//   setOfferNotifs: (_n: number) => {},
//   tradeNotifs: 0,
//   setTradeNotifs: (_n: number) => {},
//   setOffers: (_offers: Array<Offer>) => {},
//   marketNotifs: 0,
//   tradeModalOpen: false,
//   setTradeModalOpen: (_open: boolean) => {},
//   offers: [],
//   setMarketNotifs: (_n: number) => {},
//   setMarketPlace: (_marketPlace: Marketplace) => {},
//   setWaiting: (_waiting: boolean) => {},
//   setMarketplaceOpen: (_open: boolean) => {},
//   setRandomNumber: (_randomNumber: number) => {},
//   gameState: DEFAULT_STATE,
//   setName: (_name: string) => {},
//   onNewPlayerJoin: (_player: IPlayerState) => {},
//   // setToken: (_token: string) => {},
//   currentUserId: "",
//   setToken: (_token: PlayerToken, _id: string) => {},
//   setCurrentUserId: (_id: string) => {},
//   setRolling: (_rolling: boolean) => {},
//   setGameState: (_gameState: IGameState) => {},
//   onPlayerLeave: (_id: string) => {},
//   // diceRoll: (_roll: number) => {},
//   // setActiveProperty: (_property: string) => {},
//   // buyProperty: (_property: string, _type: string) => {},
//   // payRent: (_rent: number) => {},
//   // buildHouse: (_property: string) => {},
//   socket: null,
//   setActiveProperty: (_p: string) => {},
//   setSocket: (_socket: Socket) => {},
// });
export const MyContext = createContext<IMyContext>({
  name: "",
  rolling: false,
  currentUserId: "",
  offers: [],
  tradeModalOpen: false,
  marketPlaceOpen: false,
  offerNotifs: 0,
  marketNotifs: 0,
  randomNumber: 0,
  waiting: false,
  tradeNotifs: 0,
  gameState: DEFAULT_STATE,
  socket: null,

  setName: () => {},
  setRolling: () => {},
  setCurrentUserId: () => {},
  setOffers: () => {},
  setTradeModalOpen: () => {},
  setMarketplaceOpen: () => {},
  setOfferNotifs: () => {},
  setMarketNotifs: () => {},
  setRandomNumber: () => {},
  setAuction: () => {},
  setWaiting: () => {},
  setTradeNotifs: () => {},
  setGameState: () => {},
  setSocket: () => {},
  setMarketPlace: () => {},
  setToken: () => {},
  setActiveProperty: () => {},

  onNewPlayerJoin: () => {},
  onPlayerLeave: () => {},
});

// export interface IGameState {
//   active: boolean;
//   playerCurrPosition: number;
//   playerMoney: number;
//   playerProperties: Array<{ name: string; numHouses: number; Hotel: boolean }>;
//   playerUtilities: Array<string>;
//   playerRailroads: Array<string>;
//   playerMortgagedProperties: Array<{ name: string; turnsGone: number }>;
//   playerTurn: boolean;
//   activeProperty: string | null;
//   inJail: boolean;
//   turnsInJail: number;
//   propertyStates: {
//     [name: string]: {
//       ownedBy: string;
//       numHouses?: number;
//       Hotel?: boolean;
//       mortgaged: boolean;
//     };
//   };
// }

const MyProvider = ({ children }: { children: JSX.Element }) => {
  const [name, setName] = useState("");
  // const [token, setToken] = useState("");
  const [rolling, setRolling] = useState(false);
  const [marketNotifs, setMarketNotifs] = useState(0);
  const [tradeNotifs, setTradeNotifs] = useState(0);
  const [offers, setOffers] = useState<Array<Offer>>([]);
  const [tradeModalOpen, setTradeModalOpen] = useState(false);
  const [marketPlaceOpen, setMarketplaceOpen] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [offerNotifs, setOfferNotifs] = useState(0);
  const [randomNumber, setRandomNumber] = useState(0);
  const [gameState, setGameState] = useState<IGameState>(DEFAULT_STATE);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const setActiveProperty = (p: string) => {
    setGameState((prev: IGameState) => {
      return {
        ...prev,
        activeProperty: p,
      };
    });
  };
  const onNewPlayerJoin = (player: IPlayerState) => {
    setGameState((prev: IGameState) => {
      return {
        ...prev,
        playerStates: [...prev.playerStates, player],
      };
    });
  };
  const setMarketPlace = (
    marketPlace: Array<{
      name: string;
      askingPrice: number;
      owner: string;
      ownerSocketId: string;
    }>
  ) => {
    setGameState((prev: IGameState) => {
      return {
        ...prev,
        marketPlace: marketPlace,
      };
    });
  };
  const onPlayerLeave = (id: string) => {
    setGameState((prev: IGameState) => {
      return {
        ...prev,
        playerStates: [
          ...prev.playerStates.filter((player) => player.id !== id),
        ],
      };
    });
  };
  const setToken = (token: PlayerToken, id: string) => {
    setGameState((prev) => ({
      ...prev,
      playerStates: [
        ...prev.playerStates.map((ps) => {
          if (ps.id === id) {
            return { ...ps, playerToken: token };
          } else return ps;
        }),
      ],
    }));
  };
  const setAuction = (auction: IAuction) => {
    setGameState((prev) => ({
      ...prev,
      currentAuction: auction,
    }));
  };
  // const diceRoll = (roll: number) => {
  //   if (roll > 6) return;
  //   else
  //     setGameState((prev: IGameState) => {
  //       // if (prev) {
  //       let newPosition = prev.playerCurrPosition + roll;
  //       if (newPosition > 31) {
  //         newPosition = newPosition - 32;
  //       }
  //       if (newPosition === 8) {
  //         toast.error("You were sent to jail!", {
  //           position: "bottom-right",
  //           autoClose: 1000,
  //           hideProgressBar: false,
  //           closeOnClick: true,
  //           pauseOnHover: false,
  //           draggable: false,
  //           style: { fontWeight: "bold" },
  //         });
  //       }
  //       return {
  //         ...prev,
  //         playerCurrPosition: newPosition,
  //         playerMoney: prev.playerMoney + (newPosition === 0 ? 2000 : 0),
  //         inJail: newPosition === 8,
  //         activeProperty:
  //           newPosition !== 0 &&
  //           newPosition !== 8 &&
  //           newPosition !== 16 &&
  //           newPosition !== 24
  //             ? PROPERTIES[newPosition].Name
  //             : "",
  //       };
  //       // }
  //     });
  // };
  // const setActiveProperty = (property: string) => {
  //   setGameState((prev: IGameState) => {
  //     // if (prev) {
  //     return {
  //       ...prev,
  //       activeProperty: property,
  //     };
  //     // }
  //   });
  // };
  // const payRent = (rent: number) => {
  //   setGameState((prev: IGameState) => {
  //     // if (prev) {
  //     return {
  //       ...prev,
  //       playerMoney: prev.playerMoney - rent,
  //     };
  //     // }
  //   });
  // };
  // const buyProperty = (
  //   property: string,
  //   type: "Properties" | "Utilties" | "Railroads"
  // ) => {
  //   setGameState((prev: IGameState) => {
  //     // if (prev) {
  //     return {
  //       ...prev,
  //       ["player" + type]: [
  //         ...prev["player" + type],
  //         type === "Properties"
  //           ? { name: property, numHouses: 0, Hotel: false }
  //           : property,
  //       ],
  //       propertyStates: {
  //         ...prev.propertyStates,
  //         [property]: {
  //           ...prev.propertyStates[property],
  //           ownedBy: name,
  //           mortgaged: false,
  //         },
  //       },
  //       playerMoney:
  //         prev.playerMoney -
  //         (PROPERTIES.find((e) => e.Name === property)?.Price || 0),
  //     };
  //     // }
  //   });
  // };
  // const buildHouse = (property: string) => {
  //   setGameState((prev: IGameState) => {
  //     // if (prev) {
  //     return {
  //       ...prev,
  //       propertyStates: {
  //         ...prev.propertyStates,
  //         [property]: {
  //           ...prev.propertyStates[property],
  //           numHouses: (prev.propertyStates[property].numHouses || 0) + 1,
  //         },
  //       },
  //       playerProperties: prev.playerProperties.map((prop) => {
  //         if (prop.name === property) {
  //           return { ...prop, numHouses: prop.numHouses + 1 };
  //         }
  //         return prop;
  //       }),
  //       playerMoney:
  //         prev.playerMoney -
  //         (PROPERTIES.find((e) => e.Name === property)?.PricePerHouse || 0),
  //     };
  //     // }
  //   });
  // };
  const contextValue = useMemo(
    () => ({
      name,
      setName,
      // token,
      // setToken,
      rolling,
      setRolling,
      gameState,
      setGameState,
      currentUserId,
      setCurrentUserId,
      marketNotifs,
      setMarketNotifs,
      onNewPlayerJoin,
      tradeModalOpen,
      setTradeModalOpen,
      // diceRoll,
      // setActiveProperty,
      // buyProperty,
      // buildHouse,
      // payRent,
      socket,
      setSocket,
      onPlayerLeave,
      offers,
      setOffers,
      setAuction,
      setToken,
      randomNumber,
      marketPlaceOpen,
      setMarketplaceOpen,
      setRandomNumber,
      waiting,
      setWaiting,
      tradeNotifs,
      setTradeNotifs,
      setMarketPlace,
      setActiveProperty,
      offerNotifs,
      setOfferNotifs,
    }),
    [
      {
        name,
        randomNumber,
        setRandomNumber,
        setName,
        // token,
        // setToken,
        rolling,
        setRolling,
        setAuction,
        tradeModalOpen,
        setTradeModalOpen,
        marketNotifs,
        offers,
        setOffers,
        tradeNotifs,
        setTradeNotifs,
        setMarketNotifs,
        marketPlaceOpen,
        setMarketplaceOpen,
        setMarketPlace,
        waiting,
        offerNotifs,
        setOfferNotifs,
        setWaiting,
        gameState,
        setGameState,
        setActiveProperty,
        // diceRoll,
        // setActiveProperty,
        // buyProperty,
        // buildHouse,
        // payRent,
        socket,
        setSocket,
        currentUserId,
        setCurrentUserId,
        onNewPlayerJoin,
        onPlayerLeave,
        setToken,
      },
    ]
  );

  useEffect(() => {
    if (localStorage.getItem("name")) {
      setName(localStorage.getItem("name") as string);
    }
  }, []);
  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

export default MyProvider;
