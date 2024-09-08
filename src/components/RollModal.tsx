import React from "react";
import Modal from "./Modal";

const RollModal = ({ roll }: { roll: number }) => {
  return (
    <Modal isOpen>
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-center font-bold text-lg w-full">You Rolled</h1>
        <h1 className="text-center font-bold text-3xl w-full">{roll}</h1>
      </div>
    </Modal>
  );
};

export default RollModal;
