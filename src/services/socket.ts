import { io } from "socket.io-client";

// "undefined" means the URL will be computed from the `window.location` object
const URL = "ws://localhost:3000";

export const getSocket = (name: string) => {
  // Connect to the default namespace to initiate the namespace creation/joining process
  const restSocket = io(URL, {
    reconnectionDelayMax: 10000,
    autoConnect: false,
    query: {
      name,
    },
    transports: ["websocket", "polling"],
  });
  // restSocket.connect();

  // Handle the event when connected to the default namespace

  // // Handle errors in the default namespace
  // defaultSocket.on("error", (error) => {
  //   console.error(
  //     `Error in default namespace for restaurant: ${restaurant}`,
  //     error
  //   );
  // });

  return restSocket; // Return the restaurant socket (initially null, updated asynchronously)
};
