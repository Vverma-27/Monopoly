import React from "react";
import { IPlayerState } from "../Context";
import TOKENS from "../constants/tokens";

const Token = ({
  playerState: { inJail, playerCurrPosition },
  children,
  moreThan1,
}: {
  playerState: { inJail: boolean; playerCurrPosition: number };
  children: JSX.Element;
  moreThan1?: boolean;
}) => {
  const inLeftCol = playerCurrPosition < 8;
  // console.log("🚀 ~ MonopolyBoard ~ inLeftCol:", inLeftCol);
  const inRightCol = 16 <= playerCurrPosition && playerCurrPosition < 24;
  // console.log("🚀 ~ MonopolyBoard ~ inRightCol:", inRightCol);
  const isCol = inLeftCol || inRightCol;
  const inBottomRow = 24 <= playerCurrPosition;
  const isCornerCell =
    playerCurrPosition === 0 ||
    playerCurrPosition === 8 ||
    playerCurrPosition === 16 ||
    playerCurrPosition === 24;
  return (
    <div
      className={` flex justify-center items-center flex-wrap h-full transition-all`}
      style={
        inJail
          ? !moreThan1
            ? {
                gridRow: `2/ span 1`,
                gridColumn: `10/ span 1`,
              }
            : {
                gridRow: `2/ span 1`,
                gridColumn: `10/ span 2`,
              }
          : {
              gridRow: `${
                isCol
                  ? inLeftCol
                    ? 11 - (playerCurrPosition + 1)
                    : isCornerCell
                    ? 1
                    : playerCurrPosition + 2 - 16
                  : inBottomRow
                  ? 11
                  : moreThan1
                  ? 1
                  : 2
              }/ ${isCornerCell ? "span 2" : "span 1"}`,
              gridColumn: `${
                isCol
                  ? inLeftCol
                    ? 1
                    : 11
                  : inBottomRow
                  ? 10 - (playerCurrPosition - 24)
                  : playerCurrPosition - 6
              }/ ${isCornerCell ? "span 2" : isCol ? "span 2" : "span 1"}`,
            }
      }
    >
      {/* <img src={TOKENS[token].src} className="h-[7vmin] w-[7vmin] z-10" /> */}
      {children}
    </div>
  );
};

export default Token;
