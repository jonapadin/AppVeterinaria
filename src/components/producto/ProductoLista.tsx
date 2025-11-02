import { useState, useEffect } from "react";
import productosJson from "./producto.json";

interface Producto {
  id: number;
  precio: number;
  stock: number;
  descripcion: string;
  presentacion: string;
  marca: string;
  imagen: string;
  opciones_pago: {
    cuotas: number;
    monto_por_cuota: number;
    total: number;
    descripcion: string;
  };
}

interface CategoriaProductos {
  Alimento?: Producto[];
  Accesorios?: Producto[];
  Estética_e_Higiene?: Producto[];
  Salud?: Producto[];
  [key: string]: Producto[] | undefined;
}

interface ProductosJsonItem {
  categoria: {
    Perro?: CategoriaProductos;
    Gato?: CategoriaProductos;
    Aves?: CategoriaProductos;
    Exóticos?: CategoriaProductos;
  };
}

type Categoria = "Perro" | "Gato" | "Aves" | "Exóticos";

interface ProductListProps {
  categoria: Categoria;
  subcategoria: string;
}

function ProductList({ categoria, subcategoria }: ProductListProps) {
  const [productos, setProductos] = useState<Producto[]>([]);
  const productosData = productosJson as ProductosJsonItem[];

  useEffect(() => {
    if (!subcategoria) return;
    const data = productosData[0].categoria[categoria];
    const subData = data?.[subcategoria] || [];
    setProductos(subData);
  }, [categoria, subcategoria, productosData]);

  if (!subcategoria) {
    return (
      <p className="text-center text-gray-500 mt-6">
        Seleccioná una subcategoría para ver productos.
      </p>
    );
  }

  return (
    <section className="py-10 px-6 lg:px-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#8F108D]">
        {subcategoria.replaceAll("_", " ")}
      </h2>

      {productos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
          {productos.map((producto) => (
            <div
              key={producto.id}
              className="rounded-xl p-3 flex flex-col justify-between shadow-md hover:shadow-xl transition-all bg-white scale-95 hover:scale-100"
            >
              {/* Imagen */}
              <img
                src={producto.imagen}
                alt={producto.descripcion}
                className="h-40 w-auto object-contain mx-auto mb-4"
              />
                {/* Marca */}
              <p className="text-center font-semibold text-black text-xl mb-1">
                {producto.marca}
              </p>

              {/* Descripción */}
            <div className="flex items-center justify-center gap-2 mb-1">
            <p className="font-semibold text-sm text-center">
            {producto.descripcion}
          </p>
           {producto.presentacion && (
         <span className="text-xs font-semibold text-black">({producto.presentacion})</span>
        )}
          </div>

              {/* Forma de pago */}
              {producto.opciones_pago && (
                <p className="text-center text-xs text-gray-500 italic mb-1">
                  {producto.opciones_pago.descripcion}
                </p>
              )}

              {/* Stock */}
              <p
                className={`text-center text-xs font-semibold mb-2 ${
                  producto.stock > 0 ? "text-neutral-950" : "text-shadow-gray-600"
                }`}
              >
                {producto.stock > 0
                  ? `Stock: ${producto.stock} unidades`
                  : "Sin stock"}
              </p>

              {/* Precio */}
              <p className="text-center font-bold text-lg text-[#8F108D] mb-4">
                ${producto.precio.toLocaleString()}
              </p>

              {/* Botón */}
              <button
                disabled={producto.stock === 0}
                className={`w-full py-2 text-sm font-semibold border-2 rounded-md transition-colors ${
                  producto.stock === 0
                    ? "border-gray-400 text-gray-400 cursor-not-allowed"
                    : "border-[#8F108D] text-[#8F108D] hover:bg-[#8F108D] hover:text-white"
                }`}
              >
                {producto.stock === 0 ? "Sin stock" : "COMPRAR"}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No hay productos disponibles.
        </p>
      )}
    </section>
  );
}

export default ProductList;
