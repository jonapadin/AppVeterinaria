import { IoClose } from "react-icons/io5";

interface CarritoModalProps {
  onClose: () => void;
}

export default function Carrito({ onClose }: CarritoModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-80 sm:w-96 bg-white h-full p-5 shadow-xl animate-slide-in flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#8F108D]">Carrito</h2>
          <button className="text-2xl text-gray-700" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <p className="text-gray-500">Tu carrito está vacío.</p>
        </div>

        <div className="mt-4">
          <button className="w-full py-2 bg-[#8F108D] text-white font-semibold rounded hover:bg-[#8F108D] transition">
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
