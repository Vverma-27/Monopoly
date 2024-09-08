import { useContext, useEffect } from "react";
import { MyContext } from "../Context";
import { Canvas } from "@react-three/fiber";
import Dice from "../Models/Dice";
// import RollModal from "./RollModal";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";

const RollDice = () => {
  // const [showModal, setShowModal] = useState(false);
  const {
    rolling,
    setRolling,
    socket,
    randomNumber,
    setRandomNumber,
    gameState: { currTurn, playerStates },
    currentUserId,
  } = useContext(MyContext);
  var timeout: any;
  const onFinishedRolling = () => {
    // setShowModal(true);
    toast.info(
      `${
        currTurn === currentUserId
          ? "You"
          : playerStates.find((ps) => ps.id === currTurn)?.name
      } rolled a ${randomNumber}`,
      ClosableToastConfig
    );
    if (currTurn === currentUserId) {
      timeout = setTimeout(() => {
        // setShowModal(false);
        socket?.emit("dice-roll-finish", randomNumber);
        setRolling(false);
        setRandomNumber(0);
        // diceRoll(randomNumber);
      }, 1500);
    }
  };
  useEffect(() => {
    return () => clearTimeout(timeout);
  }, []);
  return (
    <>
      {rolling && randomNumber !== 0 ? (
        <Canvas className="inset-0" id="canvas">
          <directionalLight position={[0, 0, 20]} intensity={2} />
          {/* <OrbitControls /> */}
          {/* <Floor /> */}
          <Dice onFinish={onFinishedRolling} randomNumber={randomNumber} />
        </Canvas>
      ) : null}
      {/* {showModal ? <RollModal roll={randomNumber} /> : null} */}
    </>
  );
};

export default RollDice;
