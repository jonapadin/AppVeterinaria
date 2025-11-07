import { useEffect, useState } from "react";
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

type CategoriasDisponibles = {
  Perro?: Record<string, Producto[]>;
  Gato?: Record<string, Producto[]>;
  Aves?: Record<string, Producto[]>;
  Exoticos?: Record<string, Producto[]>; 
};

interface ProductosJSON {
  categoria: CategoriasDisponibles;
}

interface ProductListProps {
  categoria: "Perro" | "Gato" | "Aves" | "Exoticos";
  subcategoria: string;
  filtros: { presentaciones: string[]; marcas: string[] };
  orden: "mas-vendidos" | "menor-mayor" | "mayor-menor" | "a-z" | "z-a";
  setOrden: (
    value: "mas-vendidos" | "menor-mayor" | "mayor-menor" | "a-z" | "z-a"
  ) => void;
}

export default function ProductList({
  categoria,
  subcategoria,
  filtros,
  orden,
  setOrden,
}: ProductListProps) {
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState(orden);

  const productosData =
    (productosJson as unknown as ProductosJSON[])[0].categoria[categoria];

  useEffect(() => {
    if (!productosData) return;

    let productos = productosData[subcategoria] || [];

    if (filtros.marcas.length > 0) {
      productos = productos.filter((p) =>
        filtros.marcas.includes(p.marca.trim())
      );
    }

    if (filtros.presentaciones.length > 0) {
      productos = productos.filter((p) =>
        filtros.presentaciones.includes(p.presentacion)
      );
    }

    const ordenadores = {
      "mas-vendidos": () => 0,
      "menor-mayor": (a: Producto, b: Producto) => a.precio - b.precio,
      "mayor-menor": (a: Producto, b: Producto) => b.precio - a.precio,
      "a-z": (a: Producto, b: Producto) =>
        a.descripcion.localeCompare(b.descripcion),
      "z-a": (a: Producto, b: Producto) =>
        b.descripcion.localeCompare(a.descripcion),
    };

    productos = [...productos].sort(ordenadores[orden]);
    setProductosFiltrados(productos);
  }, [categoria, subcategoria, filtros, orden]);

  const labelMap = {
    "mas-vendidos": "Más vendidos",
    "menor-mayor": "Precio: menor a mayor",
    "mayor-menor": "Precio: mayor a menor",
    "a-z": "A-Z",
    "z-a": "Z-A",
  };

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* BOTÓN ORDEN para movil */}
      <div className="md:hidden flex justify-start mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#8F108D] text-white font-semibold rounded-lg flex items-center gap-2"
        >
          Ordenar por ▼
        </button>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-[#8F108D] w-[90%] max-w-xs rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-[#740A72]">
              <img
                src="public/assets/icons/logoVet.png"
                alt="Logo"
                className="h-7 object-contain"
              />
              <button
                onClick={() => setShowModal(false)}
                className="text-white text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col">
              {Object.keys(labelMap).map((op) => (
                <button
                  key={op}
                  onClick={() => {
                    setOrdenSeleccionado(op as any);
                    setOrden(op as any);
                  }}
                  className={`w-full text-left px-4 py-3 transition-colors ${
                    ordenSeleccionado === op
                      ? "bg-white text-[#8F108D]"
                      : "text-white hover:bg-white hover:text-[#8F108D]"
                  }`}
                >
                  {labelMap[op as keyof typeof labelMap]}
                </button>
              ))}
            </div>

            <div className="p-4">
              <button
                onClick={() => setShowModal(false)}
                className="w-full py-2 bg-white text-[#8F108D] font-semibold rounded-lg"
              >
                Aplicar filtro
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TÍTULO */}
      <h2 className="text-2xl font-bold mb-6 text-center text-[#8F108D]">
        {subcategoria.replaceAll("_", " ")}
      </h2>

      {/* Cards PRODUCTOS */}
      {productosFiltrados.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-fr">
          {productosFiltrados.map((producto) => (
            <div
              key={producto.id}
              className="rounded-xl p-3 flex flex-col justify-between shadow-md hover:shadow-xl transition-all bg-white scale-95 hover:scale-100"
            >
              <img
                src={producto.imagen}
                alt={producto.descripcion}
                className="h-40 object-contain"
              />
              <p className="text-center font-semibold text-black text-xl">
                {producto.marca}
              </p>
              <p className="font-semibold text-sm text-center break-words">
                {producto.descripcion}{" "}
                {producto.presentacion && `(${producto.presentacion})`}
              </p>
              <p className="text-center font-bold text-lg text-[#8F108D] mb-4">
                ${producto.precio.toLocaleString()}
              </p>

              <button
                disabled={producto.stock === 0}
                className={`w-full py-2 text-sm font-semibold border-2 rounded-md ${
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
        <p className="text-center text-gray-500">No hay productos disponibles.</p>
      )}
    </section>
  );
}
