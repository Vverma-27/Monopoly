import { CgArrowLongUpL } from "react-icons/cg";
import PROPERTIES from "../constants/properties";
import { MdDirectionsRailway } from "react-icons/md";
import { GiImprisoned, GiPrisoner, GiTap } from "react-icons/gi";
import { FaCar, FaRegLightbulb } from "react-icons/fa";
import { useContext, useEffect } from "react";
import { IPlayerState, MyContext, PlayerToken } from "../Context";
import TOKENS from "../constants/tokens";
import RollDice from "./DiceRoll";
import Token from "./Token";
import { toast } from "react-toastify";
import WebRTC from "./WebRTC";
import { ClosableToastConfig } from "../constants/toast";
import { Tooltip } from "react-tooltip";
import { Canvas } from "@react-three/fiber";
import House from "../Models/House";
import Hotel from "../Models/Hotel";

const MonopolyBoard = () => {
  const {
    gameState: {
      playerStates,
      currTurn,
      activeProperty,
      active,
      propertyStates,
    },
    name,
    rolling,
    socket,
    setRandomNumber,
    setRolling,
    currentUserId,
  } = useContext(MyContext);
  // const {
  //   // playerCurrPosition,
  //   // inJail,
  //   playerToken: token,
  // } = playerStates.find(
  //   (player) => player.id === currentUserId
  // ) as IPlayerState;
  // const inLeftCol = playerCurrPosition < 8;
  // // console.log("🚀 ~ MonopolyBoard ~ inLeftCol:", inLeftCol);
  // const inRightCol = 16 <= playerCurrPosition && playerCurrPosition < 24;
  // console.log("🚀 ~ MonopolyBoard ~ inRightCol:", inRightCol);
  // const isCol = inLeftCol || inRightCol;
  // const inBottomRow = 24 <= playerCurrPosition;
  const positionMap = new Map();

  // Group players by their position
  playerStates.forEach((ps) => {
    if (!positionMap.has(ps.playerCurrPosition)) {
      positionMap.set(ps.playerCurrPosition, []);
    }
    positionMap.get(ps.playerCurrPosition).push({
      token: ps.playerToken,
      inJail: ps.inJail,
      playerCurrPosition: ps.playerCurrPosition,
      name: ps.name,
    });
  });

  // Convert the map to the desired array of arrays format
  const uniquePositionsArray: {
    token: PlayerToken;
    inJail: boolean;
    playerCurrPosition: number;
    name: string;
  }[][] = Array.from(positionMap.values());

  useEffect(() => {
    if (activeProperty && currTurn !== currentUserId) {
      toast.info(
        `Waiting for ${
          (playerStates.find((ps) => ps.id === currTurn) as IPlayerState).name
        }...`,
        ClosableToastConfig
      );
    }
  }, [activeProperty, currTurn, currentUserId]);

  return (
    <div className="grid grid-cols-11 grid-rows-11 w-[98vmin] h-[98vmin] items-center bg-green-300">
      {/* <Flipper flipKey={playerCurrPosition}> */}
      {uniquePositionsArray.map((ps, i) => (
        <Token key={i} playerState={ps[0]} moreThan1={ps.length > 1}>
          <>
            {ps.map((p, i) => {
              return p.token ? (
                <>
                  <img
                    key={p.token}
                    src={TOKENS[p.token].src}
                    className="h-[5.5vmin] w-[5.5vmin] z-10"
                    data-tooltip-id={`token-${p.token}`}
                    data-tooltip-content={`${p.name === name ? "You" : p.name}${
                      p.inJail
                        ? ", in Jail"
                        : ", at " + PROPERTIES[p.playerCurrPosition].Name
                    }`}
                    data-tooltip-place="top"
                  />
                  <Tooltip id={`token-${p.token}`} className="z-[100]" />
                </>
              ) : (
                <div key={i}></div>
              );
            })}
          </>
        </Token>
      ))}
      {/* </Flipper> */}
      {/* Top Row */}
      <div className="row row-top grid">
        <div className="cell c-cell flex flex-col">
          <p>Go to</p>
          <GiImprisoned className="text-[3rem] text-[#9B6B49]" />
          <p>Jail</p>
        </div>
        {PROPERTIES.slice(9, 16).map((property, i) => {
          const state = propertyStates[property.Name];
          const houseCount = state.numHouses || 0;
          const isHotel = state.Hotel;
          return (
            <div
              key={i}
              className="cell p-cell"
              data-tooltip-id={`token-${property.Name}`}
              data-tooltip-content={`${property.Name}, ${
                state.ownedBy
                  ? `owned by ${state.ownedBy === name ? "You" : state.ownedBy}`
                  : "unowned"
              }`}
              data-tooltip-place="top"
            >
              <div className="w-full">
                <div
                  className="h-[2vmin] w-full mb-2"
                  style={{ backgroundColor: property.color }}
                />
                <p className="font-sans text-[0.5rem] font-base text-center">
                  {property.Name}
                </p>
              </div>
              {property.type === "Railroad" ? (
                <MdDirectionsRailway className="text-[#2A6BB5] text-[3rem]" />
              ) : property.type === "Utility" ? (
                property.Name === "Water Works" ? (
                  <GiTap className="text-[3rem] text-gray-500" />
                ) : (
                  <FaRegLightbulb className="text-[3rem] text-[#FAD92F]" />
                )
              ) : null}
              <p className="font-sans text-[0.5rem] font-base">
                ${property.Price}
              </p>

              {houseCount > 0 || isHotel ? (
                <div className="absolute top-0 left-0 w-full h-full">
                  <Canvas>
                    {isHotel ? <Hotel /> : <House count={houseCount} />}
                  </Canvas>
                </div>
              ) : null}
              <Tooltip id={`token-${property.Name}`} className="z-[100]" />
            </div>
          );
        })}
        {/* <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div> */}
        <div className="cell c-cell jail">
          <div className="flex flex-col h-[95%] justify-between items-start">
            <p className="self-center">Just</p>
            <div className="flex flex-col justify-center items-center pr-3 pt-1.5 border-t border-r border-black bg-[#F7650F]">
              <p className="text-white">Jail</p>
              <GiPrisoner className="h-[8vmin] w-[8vmin] text-white" />
            </div>
          </div>
          <p
            style={{
              writingMode: "vertical-rl",
              alignSelf: "center",
              flex: 1,
              marginRight: "10%",
              marginTop: "20%",
            }}
          >
            Visiting
          </p>
        </div>
      </div>

      {/* Left Column */}
      <div className="col col-left">
        {PROPERTIES.slice(1, 8)
          .reverse()
          .map((property, i) => {
            const state = propertyStates[property.Name];
            const houseCount = state.numHouses || 0;
            const isHotel = state.Hotel;
            return (
              <div
                key={i}
                className="cell p-cell relative"
                data-tooltip-id={`token-${property.Name}`}
                data-tooltip-content={`${property.Name}, ${
                  state.ownedBy
                    ? `owned by ${
                        state.ownedBy === name ? "You" : state.ownedBy
                      }`
                    : "unowned"
                }`}
                data-tooltip-place="top"
              >
                <div className="h-full">
                  <div
                    className="w-[2vmin] h-full ml-2"
                    style={{ backgroundColor: property.color }}
                  />
                  <p className="font-sans text-[0.5rem] font-base text-center">
                    {property.Name}
                  </p>
                </div>
                {property.type === "Railroad" ? (
                  <MdDirectionsRailway className="text-[#2A6BB5] text-[3rem] rotate-90" />
                ) : property.type === "Utility" ? (
                  property.Name === "Water Works" ? (
                    <GiTap className="text-[3rem] rotate-90 text-gray-500" />
                  ) : (
                    <FaRegLightbulb className="text-[3rem] rotate-90 text-[#FAD92F]" />
                  )
                ) : null}
                <p className="font-sans text-[0.5rem] font-base">
                  ${property.Price}
                </p>

                {houseCount > 0 || isHotel ? (
                  <div className="absolute top-0 left-0 w-full h-full">
                    <Canvas>
                      {isHotel ? <Hotel /> : <House count={houseCount} />}
                    </Canvas>
                  </div>
                ) : null}
                <Tooltip id={`token-${property.Name}`} className="z-[100]" />
              </div>
            );
          })}
        {/* <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div> */}
      </div>

      {/* Center (empty space for the board) */}
      <div className="center flex items-center justify-center relative z-0 flex-col">
        {/* <h1 className="z-10 font-bold w-[90%] text-3xl text-center -rotate-12 bg-[linear-gradient(178deg,#D40019,#550100)] rounded-sm py-2 text-white border-4 border-white ">
          Baniya-opoly
        </h1> */}
        {/* <h1 className="z-10 font-bold w-[90%] text-3xl text-center -rotate-12 bg-[linear-gradient(178deg,#D40019,#550100)] rounded-sm py-2 text-white border-4 border-white ">
          Monopoly
        </h1> */}
        {currTurn === currentUserId && !rolling ? (
          <div className="flex flex-col items-center justify-center w-full gap-0 z-20">
            <img src="/dice.png" className="h-20 -mb-3" />
            <button
              className="bg-[#FF9633] py-2 px-4 text-white rounded-lg text-sm mt-4"
              onClick={() => {
                if (!rolling) {
                  socket?.emit("rolled-dice", (randomNum: number) => {
                    setRandomNumber(randomNum);
                    setRolling(true);
                  });
                }
              }}
            >
              Roll Dice
            </button>
          </div>
        ) : null}
        {active ? <WebRTC /> : null}
        {/* {activeProperty && currTurn !== currentUserId ? (
          <h1
            style={{
              zIndex: 100,
              fontSize: "2rem",
              textAlign: "center",
              border: "2px solid white",
              borderRadius: "10px",
              padding: "1vh 3vw",
            }}
          >
            Waiting For <br />
            {
              (playerStates.find((ps) => ps.id === currTurn) as IPlayerState)
                .name
            }
            ...
          </h1>
        ) : null} */}
        <RollDice />
        <img src="/floor.png" className="absolute top-0 left-0" />
        {/* <img
          src="/monopoly.png"
          className="absolute top-[35%] left-10 -translate-y-1/2 -rotate-45 z-0"
        />
        <img
          src="/monopoly-2.png"
          className="absolute top-[20%] right-0 -translate-y-1/2 -rotate-12 z-0 h-[40%]"
        /> */}
      </div>

      {/* Right Column */}
      <div className="col col-right">
        {PROPERTIES.slice(17, 24)
          // .reverse()
          .map((property, i) => {
            const state = propertyStates[property.Name];
            const houseCount = state.numHouses || 0;
            const isHotel = state.Hotel;
            return (
              <div
                key={i}
                className="cell p-cell"
                data-tooltip-id={`token-${property.Name}`}
                data-tooltip-content={`${property.Name}, ${
                  state.ownedBy
                    ? `owned by ${
                        state.ownedBy === name ? "You" : state.ownedBy
                      }`
                    : "unowned"
                }`}
                data-tooltip-place="top"
              >
                <div className="h-full">
                  <div
                    className="w-[2vmin] h-full ml-2"
                    style={{ backgroundColor: property.color }}
                  />
                  <p className="font-sans text-[0.5rem] font-base text-center">
                    {property.Name}
                  </p>
                </div>
                {property.type === "Railroad" ? (
                  <MdDirectionsRailway className="text-[#2A6BB5] text-[3rem] rotate-90" />
                ) : property.type === "Utility" ? (
                  property.Name === "Water Works" ? (
                    <GiTap className="text-[3rem] rotate-90 text-gray-500" />
                  ) : (
                    <FaRegLightbulb className="text-[3rem] rotate-90 text-[#FAD92F]" />
                  )
                ) : null}
                <p className="font-sans text-[0.5rem] font-base">
                  ${property.Price}
                </p>

                {houseCount > 0 || isHotel ? (
                  <div className="absolute top-0 left-0 w-full h-full">
                    <Canvas>
                      {isHotel ? <Hotel /> : <House count={houseCount} />}
                    </Canvas>
                  </div>
                ) : null}
                <Tooltip id={`token-${property.Name}`} className="z-[100]" />
              </div>
            );
          })}
        {/* <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div> */}
      </div>

      {/* Bottom Row */}
      <div className="row row-bottom">
        <div
          className="cell c-cell flex flex-col gap-0"
          style={{ writingMode: "vertical-rl" }}
        >
          <div className="-rotate-45  flex flex-col items-center justify-center gap-0">
            <span className="text-[0.5rem] text-black font-sans text-center max-w-[17vmin]">
              Collect $2000 <br /> everytime you pass go
            </span>
            <p className=" font-display font-extrabold text-red-400 text-[3.25rem] leading-none">
              GO
            </p>
            <CgArrowLongUpL className="text-red-400 text-[3rem] -m-3" />
          </div>
        </div>

        {PROPERTIES.slice(25, 32)
          .reverse()
          .map((property, i) => {
            const state = propertyStates[property.Name];
            const houseCount = state.numHouses || 0;
            const isHotel = state.Hotel;
            return (
              <div
                key={i}
                className="cell p-cell"
                data-tooltip-id={`token-${property.Name}`}
                data-tooltip-content={`${property.Name}, ${
                  state.ownedBy
                    ? `owned by ${
                        state.ownedBy === name ? "You" : state.ownedBy
                      }`
                    : "unowned"
                }`}
                data-tooltip-place="top"
              >
                <div className="w-full">
                  <div
                    className="h-[2vmin] w-full mb-2"
                    style={{ backgroundColor: property.color }}
                  />
                  <p className="font-sans text-[0.5rem] font-base text-center">
                    {property.Name}
                  </p>
                </div>
                {property.type === "Railroad" ? (
                  <MdDirectionsRailway className="text-[#2A6BB5] text-[3rem]" />
                ) : property.type === "Utility" ? (
                  property.Name === "Water Works" ? (
                    <GiTap className="text-[3rem] text-gray-500" />
                  ) : (
                    <FaRegLightbulb className="text-[3rem] text-[#FAD92F]" />
                  )
                ) : null}
                <p className="font-sans text-[0.5rem] font-base">
                  ${property.Price}
                </p>

                {houseCount > 0 || isHotel ? (
                  <div className="absolute top-0 left-0 w-full h-full">
                    <Canvas>
                      {isHotel ? <Hotel /> : <House count={houseCount} />}
                    </Canvas>
                  </div>
                ) : null}
                <Tooltip id={`token-${property.Name}`} className="z-[100]" />
              </div>
            );
          })}
        {/* <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div>
        <div className="cell p-cell">
          <p>Property</p>
        </div> */}
        <div className="cell c-cell flex flex-col">
          <p>Free</p>
          <FaCar className="text-[3rem] text-[#D8001B]" />
          <p>Parking</p>
        </div>
      </div>
    </div>
  );
};

export default MonopolyBoard;
