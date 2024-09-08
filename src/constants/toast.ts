import { ToastOptions } from "react-toastify";

export const ClosableToastConfig: ToastOptions<unknown> = {
  position: "bottom-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  style: { fontWeight: "bold" },
};
