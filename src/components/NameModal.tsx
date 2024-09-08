import { useContext, useState } from "react";
import { MyContext } from "../Context";
import Modal from "./Modal";

const NameModal = () => {
  const { name, setName } = useContext(MyContext);
  // console.log("🚀 ~ App ~ gameState:", gameState);
  const [debouncedName, setDebouncedName] = useState("");
  return (
    <Modal isOpen={!Boolean(name)}>
      <div className="w-full flex flex-col gap-2 flex-grow overflow-hidden">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <label htmlFor="name" className="font-bold text-xs">
              Name
            </label>
            <input
              type="text"
              onChange={(e) => setDebouncedName(e.target.value)}
              value={debouncedName}
              className="bg-transparent rounded-lg text-sm font-semibold py-2 px-1 border-2"
              name="name"
              placeholder="Enter your name"
              required
            />
          </div>
        </div>
        <div className=" mt-4 flex justify-start gap-2">
          <button
            className="bg-[#FF9633] py-3.5 px-10 text-white rounded-xl text-sm"
            onClick={async () => {
              localStorage?.setItem("name", debouncedName);
              setName(debouncedName);
            }}
          >
            Continue
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default NameModal;
