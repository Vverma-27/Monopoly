import { useContext } from "react";
import { MyContext } from "../Context";
import Modal from "./Modal";
import PROPERTIES from "../constants/properties";
import { toast } from "react-toastify";
import { ClosableToastConfig } from "../constants/toast";

const PropertyModal = () => {
  const {
    gameState: { activeProperty, propertyStates, currTurn },
    // setActiveProperty,
    currentUserId,
    // buyProperty,
    // payRent,
    // buildHouse,
    name: userName,
    socket,
  } = useContext(MyContext);
  if (!activeProperty) return null;
  const propertyDetails: any = PROPERTIES.find(
    (property) => property.Name === activeProperty
  );
  const setActiveProperty = (p: string) => {
    socket?.emit("set-active-property", { property: p });
  };
  const buyProperty = (p: string, t: string) => {
    socket?.emit(
      "buy-property",
      { property: p, type: t },
      ({ error, success }: { error?: string; success?: boolean }) => {
        if (error) {
          toast.error(error, ClosableToastConfig);
        }
        if (success) {
          toast.success(`You bought ${p}`, ClosableToastConfig);
        }
      }
    );
  };
  const buildHouse = (p: string) => {
    socket?.emit(
      "build-house",
      { property: p },
      ({ error, success }: { error?: string; success?: boolean }) => {
        if (error) {
          toast.error(error, ClosableToastConfig);
        }
        if (success) {
          toast.success(`You built another house on ${p}`, ClosableToastConfig);
        }
      }
    );
  };
  const buildHotel = (p: string) => {
    socket?.emit(
      "build-hotel",
      { property: p },
      ({ error, success }: { error?: string; success?: boolean }) => {
        if (error) {
          toast.error(error, ClosableToastConfig);
        }
        if (success) {
          toast.success(`You built a hotel on ${p}`, ClosableToastConfig);
        }
      }
    );
  };
  const startAuction = () => {
    socket?.emit("start-auction", ({ error }: { error: string }) => {
      if (error) {
        toast.error(error, ClosableToastConfig);
      }
    });
  };
  const propertyState = propertyStates[activeProperty];
  // if (propertyState.ownedBy && propertyState.ownedBy !== userName) {
  //   const currentRent = propertyState.Hotel
  //     ? propertyDetails.RentHotel
  //     : propertyState.numHouses === 0
  //     ? propertyDetails.Rent
  //     : propertyDetails[`Rent${propertyState.numHouses}Houses`];
  //   toast.error(`You paid $${currentRent} to ${propertyState.ownedBy}`);
  //   payRent(currentRent);
  //   setActiveProperty("");
  //   return null;
  // }
  const owned = propertyState.ownedBy === userName;
  // if (owned && propertyDetails.type !== "Property") {
  //   setActiveProperty("");
  //   return null;
  // }
  return (
    <Modal isOpen={Boolean(activeProperty && currTurn === currentUserId)}>
      <div className="w-full flex flex-col gap-2 flex-grow overflow-hidden p-4">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col">
            <p className="font-bold text-xl">{propertyDetails.Name}</p>
            {/* <img
                        src={propertyDetails.img}
                        alt={propertyDetails.name}
                        className="mb-4"
                    /> */}
            <p className="font-bold">Price: ${propertyDetails.Price}</p>
            {propertyDetails.type === "Property" ? (
              <>
                <p className="font-bold">Rent: ${propertyDetails.Rent}</p>
                <p>Price per House: ${propertyDetails.PricePerHouse}</p>
                <p>Rent with 1 House: ${propertyDetails.Rent1House}</p>
                <p>Rent with 2 Houses: ${propertyDetails.Rent2Houses}</p>
                <p>Rent with 3 Houses: ${propertyDetails.Rent3Houses}</p>
                <p>Rent with 4 Houses: ${propertyDetails.Rent4Houses}</p>
                <p>Rent with Hotel: ${propertyDetails.RentHotel}</p>
                <p>Mortgage: ${propertyDetails.Mortgage}</p>
              </>
            ) : propertyDetails.type === "Railroad" ? (
              <>
                <p className="font-bold">Rent if 1 railroad owned: $25</p>
                <p className="font-bold">Rent if 2 railroads owned: $50</p>
                <p className="font-bold">Rent if 3 railroads owned: $75</p>
                <p className="font-bold">Rent if 4 railroads owned: $100</p>
              </>
            ) : (
              <>
                <p className="font-bold">
                  Rent if 1 utility owned: 4 times dice roll
                </p>
                <p className="font-bold">
                  Rent if 2 utility owned: 10 times dice roll
                </p>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between mt-4">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={() => {
              const type =
                propertyDetails.type === "Property"
                  ? "Properties"
                  : propertyDetails.type === "Railroad"
                  ? "Railroads"
                  : "Utilities";
              if (owned && propertyDetails.type === "Property") {
                if ((propertyState.numHouses || 0) < 4) {
                  buildHouse(activeProperty);
                } else buildHotel(activeProperty);
              }
              if (!propertyState.ownedBy) buyProperty(activeProperty, type);
              // setActiveProperty("");
            }}
          >
            {owned && propertyDetails.type === "Property"
              ? (propertyState.numHouses || 0) < 4
                ? "Build House"
                : "Build Hotel"
              : "Buy"}
          </button>
          <button
            className="bg-red-500 text-white py-2 px-4 rounded"
            onClick={() => {
              if (!owned) startAuction();
              setActiveProperty("");
            }}
          >
            {owned ? "Continue" : "Don't Buy"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default PropertyModal;
