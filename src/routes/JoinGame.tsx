import { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MyContext } from "../Context";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";

const JoinGame = () => {
  let [searchParams] = useSearchParams();
  const { socket, setCurrentUserId, setGameState } = useContext(MyContext);
  const navigate = useNavigate();
  useEffect(() => {
    const gameID = searchParams.get("gameID");
    if (gameID) {
      socket?.emit(
        "join-game",
        gameID,
        ({
          error,
          state,
          cUserId,
        }: {
          error?: string;
          state?: any;
          cUserId: string;
        }) => {
          if (error) toast.error(error, ClosableToastConfig);
          else {
            toast.success("Joined Game", ClosableToastConfig);
            setCurrentUserId(cUserId);
            setGameState(state);
            navigate("/game");
          }
        }
      );
    }
  }, [socket]);
  return <div>Joining</div>;
};

export default JoinGame;
