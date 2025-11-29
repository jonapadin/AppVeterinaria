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

  // 🟣 AGREGAR AL CARRITO ↓
  function agregarAlCarrito(producto: Producto) {
    setCarrito((prev) => {
      const itemExistente = prev.find((p) => p.producto.id === producto.id);

      if (itemExistente) {
        if (itemExistente.producto.stock <= 0) return prev;

        return prev.map((item) =>
          item.producto.id === producto.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                producto: {
                  ...item.producto,
                  stock: item.producto.stock - 1,
                },
              }
            : item
        );
      }

      return [
        ...prev,
        {
          producto: { ...producto, stock: producto.stock - 1 },
          cantidad: 1,
        },
      ];
    });
  }

  // 🟣 SUMAR (+) ↓
  function sumar(id: number) {
    setCarrito((prev) =>
      prev.map((item) => {
        if (item.producto.id !== id) return item;

        if (item.producto.stock <= 0) return item; // ❗ evitar sumar sin stock

        return {
          ...item,
          cantidad: item.cantidad + 1,
          producto: {
            ...item.producto,
            stock: item.producto.stock - 1,
          },
        };
      })
    );
  }

  // 🟣 RESTAR (–) ↓
  function restar(id: number) {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.producto.id !== id) return item;

          // Si queda 1 → lo sacamos del carrito
          if (item.cantidad <= 1) {
            return null;
          }

          return {
            ...item,
            cantidad: item.cantidad - 1,
            producto: {
              ...item.producto,
              stock: item.producto.stock + 1,
            },
          };
        })
        .filter(Boolean) as ItemCarrito[]
    );
  }

  // 🟣 ELIMINAR (devuelve todo el stock del item)
  function eliminar(id: number) {
    setCarrito((prev) => {
      const item = prev.find((i) => i.producto.id === id);
      if (!item) return prev;

      const devolverStock = item.cantidad;

      // 1️⃣ devolver stock
      const actualizados = prev.map((i) =>
        i.producto.id === id
          ? {
              ...i,
              producto: {
                ...i.producto,
                stock: i.producto.stock + devolverStock,
              },
            }
          : i
      );

      // 2️⃣ quitar del carrito
      return actualizados.filter((i) => i.producto.id !== id);
    });
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
