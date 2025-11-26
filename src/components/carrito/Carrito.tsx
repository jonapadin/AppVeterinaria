import { useCarrito } from "./CarritoContext";
import { IoClose } from "react-icons/io5";

interface CarritoModalProps {
  onClose: () => void;
}

export default function Carrito({ onClose }: CarritoModalProps) {
  const { carrito, sumar, restar, eliminar, total } = useCarrito();

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
          <h2 className="text-xl lg:text-2xl   font-bold text-[#8F108D]">Carrito</h2>
          <button className="text-2xl text-gray-700" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {carrito.length === 0 ? (
            <p className="text-gray-500">Tu carrito está vacío.</p>
          ) : (
            carrito.map((item) => (
              <div
                key={item.producto.id}
                className="flex items-center justify-between border-b py-2"
              >
                <img
                  src={item.producto.img}
                  alt={item.producto.descripcion}
                  className="w-20 h-20 object-contain rounded mr-2"
                />

                <div className="flex-1">
                  <p className="font-semibold">{item.producto.marca}</p>
                  <p className="text-md text-gray-600">${item.producto.precio}</p>

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => restar(item.producto.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <span>{item.cantidad}</span>

                    <button
                      onClick={() => sumar(item.producto.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => eliminar(item.producto.id)}
                  className="text-[#8F108D]"
                >
                  <IoClose />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="mt-4">
          <p className="font-bold mb-2">Total: ${total}</p>

          <button
            disabled={carrito.length === 0}
            className={`w-full py-2 bg-[#8F108D] text-white font-semibold rounded 
              ${carrito.length === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}
