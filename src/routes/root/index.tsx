import { useContext, useState } from "react";
import JoinGameModal from "../../components/JoinGameModal";
import { MyContext } from "../../Context";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const [showGameModal, setShowGameModal] = useState(false);
  const { socket, setCurrentUserId, setGameState } = useContext(MyContext);
  const navigate = useNavigate();
  return (
    <section className="w-full h-full bg-[#161515] flex justify-center items-center flex-col px-[5vw] py-[4vh] gap-[10vh]">
      <div className="w-full flex items-center justify-center relative z-0 ">
        {/* <h1 className="z-10 font-bold px-[10vw] py-[4vh] text-3xl text-center bg-[linear-gradient(178deg,#D40019,#550100)] rounded-lg text-white border-4 border-white ">
          Baniya-opoly
        </h1> */}
        <h1 className="z-10 font-bold px-[10vw] py-[4vh] text-3xl text-center bg-[linear-gradient(178deg,#D40019,#550100)] rounded-lg text-white border-4 border-white ">
          Monopoly
        </h1>
      </div>
      {/* <img
        src="/monopoly.png"
        className="fixed top-[25%] left-[10vw] -translate-y-1/2 -rotate-45 z-0 scale-[1.25]"
      />
      <img
        src="/monopoly-2.png"
        className="fixed top-[20%] right-0 -translate-y-1/2 z-0 rotate-12 h-[40%] scale-[0.9]"
      />
      <img
        src="/monopoly-3.png"
        className="fixed bottom-20 left-[5vw] -rotate-12 z-0 scale-[1.3] hover:animate-spin"
      />
      <img
        src="/monopoly-4.png"
        className="fixed bottom-2 -right-20 z-0 rotate-12 h-[40%] scale-[0.8] hover:animate-spin"
      /> */}
      <div className="flex justify-center gap-[5vw] items-center w-full">
        <button
          // onClick={() => navigate("/getting-started")}
          // onClick={() => ""}
          onClick={() => setShowGameModal(true)}
          className="w-[20vw] px-[2vmax] py-[3vmin] bg-[#ffff] text-black rounded-lg text-sm mt-4"
        >
          Join Game
        </button>
        <button
          // onClick={() => navigate("/getting-started")}
          // onClick={() => ""}
          onClick={() => {
            socket?.emit(
              "create-game",
              ({ cUserId, state }: { state: any; cUserId: string }) => {
                setGameState(state);
                setCurrentUserId(cUserId);
                navigate("/game");
              }
            );
          }}
          className="w-[20vw] px-[2vmax] py-[3vmin] border-2 border-[#ffff] bg-transparent text-white rounded-lg text-sm mt-4"
        >
          Create Game
        </button>
      </div>
      <JoinGameModal
        open={showGameModal}
        setOpen={(bool: boolean) => setShowGameModal(bool)}
      />
    </section>
  );
};

export default HomePage;
