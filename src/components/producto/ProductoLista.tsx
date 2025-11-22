import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useProductos} from "../../components/producto/Fetch";
import type { Producto } from "../../components/producto/Fetch";
import Paginator from "../../components/producto/Paginador";

interface ProductListProps {
  categoria: "Perro" | "Gato" | "Aves" | "Exoticos";
  subcategoria: string;
  filtros: { presentaciones: string[]; marcas: string[] };
  orden: "menor-mayor" | "mayor-menor" | "a-z" | "z-a";
  setOrden: (value: "menor-mayor" | "mayor-menor" | "a-z" | "z-a") => void;
}

export default function ProductList({
  categoria,
  subcategoria,
  filtros,
  orden,
  setOrden,
}: ProductListProps) {
  const { productos, loading } = useProductos();
  const [productosFiltrados, setProductosFiltrados] = useState<Producto[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [ordenSeleccionado, setOrdenSeleccionado] = useState(orden);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 8;

  useEffect(() => {
    if (loading) return;

    let filtrados = productos.filter(
      (p) => p.categoria === categoria && p.subcategoria === subcategoria
    );

    if (filtros.marcas.length > 0) {
      filtrados = filtrados.filter((p) =>
        filtros.marcas.includes(p.marca.trim())
      );
    }

    if (filtros.presentaciones.length > 0) {
      filtrados = filtrados.filter((p) =>
        filtros.presentaciones.includes(p.kg.toString())
      );
    }

    const ordenadores = {
      "menor-mayor": (a: Producto, b: Producto) => a.precio - b.precio,
      "mayor-menor": (a: Producto, b: Producto) => b.precio - a.precio,
      "a-z": (a: Producto, b: Producto) => a.descripcion.localeCompare(b.descripcion),
      "z-a": (a: Producto, b: Producto) => b.descripcion.localeCompare(a.descripcion),
    };

    setProductosFiltrados([...filtrados].sort(ordenadores[orden]));
    setCurrentPage(1);
  }, [productos, categoria, subcategoria, filtros, orden, loading]);

  const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

  const labelMap = {
    "menor-mayor": "menor a mayor",
    "mayor-menor": "mayor a menor",
    "a-z": "A-Z",
    "z-a": "Z-A",
  };

  if (loading) return <p className="text-center text-gray-500">Cargando productos...</p>;

  return (
    <section className="max-w-7xl mx-auto px-4">
      {/* Botón de orden para móvil */}
      <div className="md:hidden flex justify-end mb-4">
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-[#8F108D] text-white font-semibold rounded-lg flex items-center gap-2"
        >
          Ordenar por <ChevronDown size={10} />
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center">
          <div className="bg-[#8F108D] w-[70%] max-w-xs rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-[#8F108D]">
              <img
                src="/assets/img/banner-product/logoVet.png"
                alt="Logo"
                className="h-7 object-contain"
              />
              <button
                onClick={() => setShowModal(false)}
                className="text-white text-base font-bold"
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

      {/* Título */}
      <h2 className="text-2xl font-bold mb-6 text-center text-[#8F108D]">
        {subcategoria.replaceAll("_", " ")}
      </h2>

      {/* Cards */}
      {productosPaginados.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 auto-rows-fr">
          {productosPaginados.map((producto) => (
            <div
              key={producto.id}
              className="rounded-xl p-3 flex flex-col justify-between shadow-md hover:shadow-xl transition-all bg-white scale-95 hover:scale-100"
            >
              <img src={producto.img} alt={producto.descripcion} className="h-40 object-contain" />
              <p className="text-center font-semibold text-black text-sm lg:text-xl">{producto.marca}</p>
              <p className="font-semibold text-xs lg:text-sm text-center break-words">
                {producto.descripcion} {producto.kg && `(${producto.kg} kg)`}
              </p>
              <p className="text-center font-bold text-base lg:text-lg text-[#8F108D] mb-2">
                ${producto.precio.toLocaleString()}
              </p>
              {producto.opciones_pago && (
                <div className="text-center text-sm text-gray-600 mb-4">
                  <p>{producto.opciones_pago.cuotas} cuotas de ${producto.opciones_pago.precio_cuota.toLocaleString()}</p>
                </div>
              )}
              <button
                disabled={producto.stock === 0}
                className={`w-full py-2 text-xs lg:text-sm font-semibold border-2 rounded-md ${
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

      {/* Paginación */}
      {productosFiltrados.length > itemsPerPage && (
        <Paginator currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      )}
    </section>
  );
}
