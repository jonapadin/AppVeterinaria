import { useState } from "react"; 
import { IoClose } from "react-icons/io5";
import { useCarrito } from "./CarritoContext";
import { formatearPrecio } from "../producto/FormatoPrecios";

// URL base de tu backend de NestJS (ajusta el puerto/ruta si es necesario)
const NESTJS_BASE_URL = "https://apiv1-vet.onrender.com";

interface CarritoModalProps {
  onClose: () => void;
}

export default function Carrito({ onClose }: CarritoModalProps) {
  const { carrito, sumar, restar, eliminar, total } = useCarrito(); // Nuevo estado para manejar la carga/deshabilitar el botón
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false); /**
   * Función para iniciar el checkout de Mercado Pago */

  const handleCheckout = async () => {
    if (carrito.length === 0) return;
    setIsSubmitting(true); // Mapear los ítems del carrito al formato esperado por Mercado Pago

    const itemsMP = carrito.map((item) => ({
      // Asegúrate de que el id, title, unit_price y quantity existan en tu objeto item.producto
      id: item.producto.id.toString(),
      title: item.producto.marca,
      unit_price: item.producto.precio,
      quantity: item.cantidad,
    }));

    try {
      //  Llamar al endpoint de NestJS para crear la preferencia
      const response = await fetch(
      
        `${NESTJS_BASE_URL}/api/v1/checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            items: itemsMP,
            total: total,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json(); // Redirigir al usuario

        const redirectUrl = data.redirectUrl || data.url;

        if (redirectUrl) {
          window.location.href = redirectUrl;
          return; // Detener la ejecución para evitar finally
        } else {
          throw new Error("No se recibió la URL de pago.");
        }
      } // Si no fue 'ok' (4xx o 5xx)

      console.error("Error al iniciar el pago:", response.status);
      alert("Error al iniciar el proceso de pago.");
    } catch (error) {
      console.error("Error de red/conexión o servidor:", error);
      alert("Ocurrió un error al procesar el pago.");
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <h2 className="text-xl lg:text-2xl 2xl:text-4xl  font-bold text-[#8F108D]">
            Carrito
          </h2>
          <button className="text-2xl text-gray-700" onClick={onClose}>
            <IoClose />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {carrito.length === 0 ? (
            <p className="text-gray-500 2xl:text-xl">Tu carrito está vacío.</p>
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
                  <p className="text-md text-gray-600">
                    ${formatearPrecio(item.producto.precio)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Stock:{" "}
                    {item.producto.stock > 0
                      ? item.producto.stock
                      : "Sin stock"}
                  </p>

                  <div className="flex gap-2 mt-1">
                    <button
                      onClick={() => restar(item.producto.id)}
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>

                    <p className="flex gap-2 mt-1 text-base font-semibold">
                      {item.cantidad}
                    </p>
                    <button
                      onClick={() => sumar(item.producto.id)}
                      disabled={item.producto.stock <= 0}
                      className={`px-2 py-1 rounded
                    ${
                      item.producto.stock <= 0
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-gray-200"
                    }`}
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
          <p className="font-bold text-lg mb-2">
            Total: ${formatearPrecio(total)}
          </p>
          <button
            onClick={handleCheckout} // Llamar a la función de pago
            disabled={carrito.length === 0 || isSubmitting} // Deshabilitar si está vacío o enviando
            className={`w-full py-2 bg-[#8F108D] text-white font-semibold rounded
            ${carrito.length === 0 || isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? "Iniciando Pago..." : "Finalizar compra"}
          </button>
        </div>
      </div>
    </div>
  );
}
