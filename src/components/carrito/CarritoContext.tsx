import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Producto } from "../producto/Fetch";


export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
// Definimos qué funciones y datos que tiene elcarrito
interface CarritoContextType {
  carrito: ItemCarrito[];
  agregarAlCarrito: (producto: Producto) => void;
  sumar: (id: number) => void;
  restar: (id: number) => void;
  eliminar: (id: number) => void;
  total: number;
}
// Creamos el contexto inicia sin valor
const CarritoContext = createContext<CarritoContextType | undefined>(undefined);
// Provider que envuelve la app y permite usar el carrito desde cualquier componente
export function CarritoProvider({ children }: { children: ReactNode }) {
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  //  AGREGAR AL CARRITO 
  function agregarAlCarrito(producto: Producto) {
    setCarrito((prev) => {
       // Buscamos si el producto ya está en el carrito
      const itemExistente = prev.find((p) => p.producto.id === producto.id);
        // Si ya existe  solo sumamos 1 unidad
      if (itemExistente) {
        if (itemExistente.producto.stock <= 0) return prev; // No permite sumar si no hay stock
      // Actualizamos cantidad y reducimos stock
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
             // Si NO existe lo agregamos con cantidad 1

      return [
        ...prev,
        {
          producto: { ...producto, stock: producto.stock - 1 },
          cantidad: 1,
        },
      ];
    });
  }

    //SUMAR UNA UNIDAD DE UN PRODUCTO 
  function sumar(id: number) {
    setCarrito((prev) =>
      prev.map((item) => {
         // Si no es el producto buscado lo dejamos igual
        if (item.producto.id !== id) return item;

        if (item.producto.stock <= 0) return item; //  evitar sumar sin stock

         // Aumentamos la cantidad y bajamos el stock
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

  //  RESTAR 
  function restar(id: number) {
    setCarrito((prev) =>
      prev
        .map((item) => {
          if (item.producto.id !== id) return item;

          // Si queda 1 → lo sacamos del carrito
          if (item.cantidad <= 1) {
            return null;
          }
            // Disminuimos la cantidad y aumentamos el stock
          return {
            ...item,
            cantidad: item.cantidad - 1,
            producto: {
              ...item.producto,
              stock: item.producto.stock + 1,
            },
          };
        })   // Quitamos los null cuando se elimina el producto)
        .filter(Boolean) as ItemCarrito[]
    );
  }

  //  ELIMINAR y devuelve todo el stock 
  function eliminar(id: number) {
    setCarrito((prev) => {
      const item = prev.find((i) => i.producto.id === id);
      if (!item) return prev;
          // Devolvemos todo el stock según la cantidad del carrito
      const devolverStock = item.cantidad;

      // Primero actualizamos el stock
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

      //  quitar del carrito
      return actualizados.filter((i) => i.producto.id !== id);
    });
  }
  // Recorre el carrito y suma precio × cantidad de cada producto
  const total = carrito.reduce(
    (acc, item) => acc + item.producto.precio * item.cantidad,
    0
  );
  // expone las funciones para que cualquier componente pueda usarlas
  return (
    <CarritoContext.Provider
      value={{ carrito, agregarAlCarrito, sumar, restar, eliminar, total }}
    >
      {children}
    </CarritoContext.Provider>
  );
}
// Hook para usar el carrito en otros componentes 
export function useCarrito() {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
