import { useProductos, type Producto } from "../producto/Fetch";
import type { CategoriaProducto } from "../../enums/categoriaProductos";
import type { SubcategoriaProducto } from "../../enums/subCategoriaProductos";

interface ProductListProps {
  categoria: CategoriaProducto;
  subcategoria: SubcategoriaProducto;
  filtros: { presentaciones: string[]; marcas: string[] };
  orden: "menor-mayor" | "mayor-menor" | "a-z" | "z-a";
  setOrden: React.Dispatch<React.SetStateAction<"menor-mayor" | "mayor-menor" | "a-z" | "z-a">>;
  productos?: Producto[];
}

export default function ProductList({
  categoria,
  subcategoria,
  filtros,
  orden,
  setOrden,
  productos,
}: ProductListProps) {
  const { productos: productosApi } = useProductos();
  const productosAMostrar = productos ?? productosApi;

  // Filtrar productos
  const filtrados = productosAMostrar.filter(
    (p) =>
      p.categoria === categoria &&
      p.subcategoria === subcategoria &&
      (filtros.marcas.length === 0 || filtros.marcas.includes(p.marca)) &&
      (filtros.presentaciones.length === 0 || filtros.presentaciones.includes(p.kg.toString()))
  );

  // Ordenar productos
  const ordenados = [...filtrados].sort((a, b) => {
    switch (orden) {
      case "menor-mayor":
        return a.precio - b.precio;
      case "mayor-menor":
        return b.precio - a.precio;
      case "a-z":
        return a.marca.localeCompare(b.marca);
      case "z-a":
        return b.marca.localeCompare(a.marca);
      default:
        return 0;
    }
  });

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-semibold">
      {ordenados.map((prod) => (
        <div
          key={prod.id}
          className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex flex-col items-center text-center bg-white w-70"
        >
          <img
            src={prod.img}
            alt={prod.descripcion}
            className="w-32 h-48 object-cover rounded mb-3"
          />
          <p className="font-bold text-lg">{prod.marca}</p>
          <p className="text-md mb-2 text-gray-600">{prod.descripcion}</p>
          <p className="text-[#8F108D] font-semibold mb-3">${prod.precio}</p>
          <button
            className="bg-[#8F108D] text-white text-md px-6 py-2 rounded hover:bg-purple-700 transition"
            onClick={() => console.log("Comprar producto", prod.id)}
          >
            Comprar
          </button>
        </div>
      ))}
    </div>
  );
}
