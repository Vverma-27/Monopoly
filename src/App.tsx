import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import NameModal from "./components/NameModal";
import { useContext, useEffect } from "react";
import { getSocket } from "./services/socket";
import {
  IGameState,
  IPlayerState,
  Marketplace,
  MyContext,
  Offer,
  PlayerToken,
} from "./Context";
import Game from "./routes/Game";
import { ClosableToastConfig } from "./constants/toast";
import JoinGame from "./routes/JoinGame";
import WebRTC from "./components/WebRTC";

function App() {
  // useEffect(() => {
  //   // Only run this code on the client side
  //   if (localStorage.getItem("name")) {
  //     setName(localStorage.getItem("name") as string);
  //     setDebouncedName(localStorage.getItem("name") as string);
  //   }
  // }, []);
  const {
    setSocket,
    name,
    onNewPlayerJoin,
    onPlayerLeave,
    setToken,
    setGameState,
    setRolling,
    setRandomNumber,
    setWaiting,
    setActiveProperty,
    setMarketNotifs,
    setMarketPlace,
    setOffers,
    setOfferNotifs,
    // currentUserId,
    // gameState: { playerStates },
  } = useContext(MyContext);
  useEffect(() => {
    if (!name) return;
    const socket = getSocket(name);
    socket.on("connect", () => {
      console.log("Connected to server");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });
    socket.on("player-join", ({ newPlayer }: { newPlayer: IPlayerState }) => {
      onNewPlayerJoin(newPlayer);
    });
    socket.on("player-leave", ({ playerId }: { playerId: string }) => {
      onPlayerLeave(playerId);
    });
    socket.on("game-started", ({ state }: { state: IGameState }) => {
      setGameState(state);
    });
    socket.on("rolled-dice", ({ roll }: { roll: number }) => {
      setRolling(true);
      setRandomNumber(roll);
    });
    socket.on("set-active-property", (property: string) => {
      setActiveProperty(property);
    });
    socket.on("buy-offer-accepted", ({ from, property, price }) => {
      toast.success(
        `You bought ${property} from ${from} for $${price}`,
        ClosableToastConfig
      );
    });
    socket.on(
      "chance-skipped",
      ({ chances, name: nameArg }: { chances: number; name: string }) => {
        chances === 1
          ? toast.warning(
              `${nameArg === name ? "You" : nameArg} skipped a chance in jail`,
              ClosableToastConfig
            )
          : toast.warning(
              `${
                nameArg === name ? "You" : nameArg
              } have skipped ${chances} chances`,
              ClosableToastConfig
            );
      }
    );
    socket.on("trade-offer-accepted", ({ from, property }) => {
      toast.success(`You bought ${property} from ${from}`, ClosableToastConfig);
    });
    socket.on("buy-offer-rejected", ({ from, property, price }) => {
      toast.success(
        `${from} rejected your offer for ${property} for $${price}`,
        ClosableToastConfig
      );
    });
    socket.on("trade-offer-rejected", ({ from, property }) => {
      toast.success(
        `${from} rejected your trade for ${property}`,
        ClosableToastConfig
      );
    });
    socket.on("state-sync", ({ state }: { state: IGameState }) => {
      setGameState(state);
    });
    socket.on("sent-to-jail", ({ name: nameArg }: { name: string }) => {
      toast.error(
        `${name === nameArg ? "You were" : `${name} was`} sent to jail!`,
        ClosableToastConfig
      );
    });
    socket.on("buy-offer-received", (offer: Offer) => {
      const of: Offer = { ...offer, type: "buy" } as Extract<
        Offer,
        { type: "buy" }
      >;
      setOffers((prev: Offer[]) => [...prev, of]);
      setOfferNotifs((prev) => prev + 1);
    });
    socket.on("trade-offer-received", (offer: Offer) => {
      const of: Offer = { ...offer, type: "trade" } as Extract<
        Offer,
        { type: "trade" }
      >;
      setOffers((prev: Offer[]) => [...prev, of]);
      setOfferNotifs((prev) => prev + 1);
    });
    socket.on(
      "dice-roll-finish",
      ({ playerState }: { playerState: IPlayerState }) => {
        setRolling(false);
        setRandomNumber(0);
        //@ts-ignore
        setGameState((state) => {
          return {
            ...state,
            playerStates: state.playerStates.map((player: IPlayerState) => {
              if (player.id === playerState.id) {
                return playerState;
              }
              return player;
            }),
          };
        });
        setWaiting(true);
      }
    );
    socket.on("round-end", ({ state }: { state: IGameState }) => {
      setGameState(state);
      setWaiting(false);
    });
    socket.on(
      "marketplace-listed",
      ({ marketPlace }: { marketPlace: Marketplace }) => {
        setMarketPlace(marketPlace);
        setMarketNotifs((prev) => prev + 1);
      }
    );
    socket.on(
      "property-bought",
      ({ name, property }: { name: string; property: string }) => {
        toast.info(`${name} bought ${property}`, ClosableToastConfig);
      }
    );
    socket.on(
      "property-mortgaged",
      ({
        name,
        property,
        state,
      }: {
        name: string;
        property: string;
        state: IGameState;
      }) => {
        toast.info(`${name} mortgaged ${property}`);
        setGameState(state);
      }
    );
    socket.on(
      "property-unmortgaged",
      ({
        name,
        property,
        state,
      }: {
        name: string;
        property: string;
        state: IGameState;
      }) => {
        toast.info(`${name} unmortgaged ${property}`);
        setGameState(state);
      }
    );
    socket.on(
      "house-built",
      ({ name, property }: { name: string; property: string }) => {
        toast.info(`${name} built a house on ${property}`);
      }
    );
    socket.on(
      "hotel-built",
      ({ name, property }: { name: string; property: string }) => {
        toast.info(`${name} built a hotel on ${property}`);
      }
    );
    socket.on(
      "token-select",
      ({ token, id }: { token: PlayerToken; id: string }) => {
        setToken(token, id);
      }
    );
    socket.on(
      "paid-rent",
      ({ to, from, amount }: { to: string; from: string; amount: number }) => {
        if (to === name)
          toast.success(
            `You received $${amount} as rent from ${from}`,
            ClosableToastConfig
          );
        else
          toast.error(
            `${from === name ? "You" : from} paid $${amount} as rent to ${to}`,
            ClosableToastConfig
          );
      }
    );
    socket.connect();
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, [name]);
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/game",
      element: <Game />,
    },
    {
      path: "/join",
      element: <JoinGame />,
    },
    {
      path: "*",
      element: <Navigate to="/" />,
    },
  ]);
  return (
    <div className="flex justify-center items-center bg-black h-full overflow-hidden">
      <ToastContainer />
      <NameModal />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
