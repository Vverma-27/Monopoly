import { useEffect } from "react";

const Modal = ({
  isOpen,
  children,
  className,
}: {
  isOpen: boolean;
  onClose?: () => void;
  children: JSX.Element;
  notClosable?: boolean;
  className?: string;
}) => {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "initial";
    };
  }, [isOpen]);
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 ">
      <div
        className={`bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative max-h ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
