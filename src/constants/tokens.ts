import { PlayerToken } from "../Context";

const TOKENS = {
  [PlayerToken.NA]: { name: "", src: "" },
  [PlayerToken.TOP_HAT]: {
    name: "Top Hat",
    src: "/top-hat.png", // Replace with the actual path to the PNG file
  },
  [PlayerToken.DOG]: {
    name: "Dog",
    src: "/dog.png", // Replace with the actual path to the PNG file
  },
  [PlayerToken.CAT]: {
    name: "Cat",
    src: "/cat.png", // Replace with the actual path to the PNG file
  },
  [PlayerToken.WHEELBARROW]: {
    name: "Wheelbarrow",
    src: "/wheelbarrow.png", // Replace with the actual path to the PNG file
  },
  [PlayerToken.THIMBLE]: {
    name: "Thimble",
    src: "/thimble.png", // Replace with the actual path to the PNG file
  },
};

export default TOKENS;
