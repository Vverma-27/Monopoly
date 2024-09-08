import { useContext, useState } from "react";
import Modal from "./Modal";
import { MyContext } from "../Context";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ClosableToastConfig } from "../constants/toast";

const JoinGameModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (_bool: boolean) => void;
}) => {
  const { socket, setCurrentUserId, setGameState } = useContext(MyContext);
  const [gameCode, setGameCode] = useState<string>("");
  const navigate = useNavigate();
  return (
    <Modal isOpen={open}>
      <div className="w-full flex flex-col gap-2 flex-grow overflow-hidden">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <label htmlFor="gameCode" className="font-bold text-xs">
              Game Code
            </label>
            <input
              type="text"
              onChange={(e) => setGameCode(e.target.value)}
              value={gameCode}
              className="bg-transparent rounded-lg text-sm font-semibold py-2 px-1 border-2"
              name="gameCode"
              placeholder="Enter the code"
              required
            />
          </div>
        </div>
        <div className=" mt-4 flex justify-start gap-2">
          <button
            className="bg-[#FF9633] py-3.5 px-10 text-white rounded-xl text-sm"
            onClick={async () => {
              // setOpen(false);
              socket?.emit(
                "join-game",
                gameCode,
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
                    setOpen(false);
                    navigate("/game");
                  }
                }
              );
            }}
          >
            Join
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default JoinGameModal;
