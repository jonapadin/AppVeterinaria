import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Producto } from "../producto/Fetch";

export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}

interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarAlCarrito: (producto: Producto) => void;
  sumar: (id: number) => void;
  restar: (id: number) => void;
  eliminar: (id: number) => void;
  total: number;
}

const CarritoContext = createContext<CarritoContextType | undefined>(undefined);

export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  function agregarAlCarrito(producto: Producto) {
    setCarrito((prev) => {
      const existente = prev.find((item) => item.producto.id === producto.id);
      if (existente) {
        if (existente.cantidad >= producto.stock) return prev;
        return prev.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { producto, cantidad: 1 }];
    });
  }

  function sumar(id: number) {
    setCarrito((prev) =>
      prev.map((item) =>
        item.producto.id === id
          ? item.cantidad < item.producto.stock
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
          : item
      )
    );
  }

  function restar(id: number) {
    setCarrito((prev) =>
      prev
        .map((item) =>
          item.producto.id === id
            ? { ...item, cantidad: item.cantidad - 1 }
            : item
        )
        .filter((item) => item.cantidad > 0)
    );
  }

  function eliminar(id: number) {
    setCarrito((prev) => prev.filter((item) => item.producto.id !== id));
  }

  const total = carrito.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, sumar, restar, eliminar, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
}

export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
