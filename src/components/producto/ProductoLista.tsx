import { useProductos, type Producto } from "../producto/Fetch";
import type { CategoriaProducto } from "../../enums/categoriaProductos";
import type { SubcategoriaProducto } from "../../enums/subCategoriaProductos";
import { useCarrito } from "../carrito/CarritoContext";
import { formatearPrecio } from "./FormatoPrecios";
import toast from "react-hot-toast";


interface ProductListProps {
  categoria: CategoriaProducto;
  subcategoria: SubcategoriaProducto;
  filtros: { presentaciones: string[]; marcas: string[] };
  orden: "menor-mayor" | "mayor-menor" | "a-z" | "z-a";
  productos?: Producto[];
}


export default function ProductList({
  categoria,
  subcategoria,
  filtros,
  orden,
  productos,
}: ProductListProps) {
  const { productos: productosApi } = useProductos();
  const productosAMostrar = productos ?? productosApi;
  const { agregarAlCarrito } = useCarrito();

  // Filtrar productos 
  const filtrados = productosAMostrar.filter(
    (p) =>
      p.categoria === categoria &&
      p.subcategoria === subcategoria &&
      (filtros.marcas.length === 0 || filtros.marcas.includes(p.marca)) &&
      (filtros.presentaciones.length === 0 ||
        (p.kg !== null &&
          p.kg !== undefined &&
          filtros.presentaciones.includes(String(p.kg))))
  );

  // Ordenar productos
  const ordenados = [...filtrados].sort((a, b) => {
  switch (orden) {
    case "menor-mayor":
      return a.precio - b.precio;
    case "mayor-menor":
      return b.precio - a.precio;
    case "a-z":
      return a.marca.localeCompare(b.marca, undefined, { sensitivity: "base" });
    case "z-a":
      return b.marca.localeCompare(a.marca, undefined, { sensitivity: "base" });
    default:
      return 0;
  }
});

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 font-semibold">
      {ordenados.map((prod) => (
        <div
          key={prod.id}
          className="p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200
                     flex flex-col items-center text-center bg-white 2xl:w-70"
        >
          <img
            src={prod.img}
            alt={prod.descripcion}
            className="
              w-24 h-24
              sm:w-28 sm:h-28     
              md:w-32 md:h-32     
              lg:w-36 lg:h-36     
              xl:w-40 xl:h-40     
              object-contain
              rounded
              mb-2"
          />

          <p className="font-bold text-md md:text-lg">{prod.marca}</p>
          <p className="text-xs md:text-sm mb-2 text-gray-600">
            {prod.descripcion}
          </p>
          {prod.kg !== null && (
         <p className="text-sm text-gray-700 mb-2">{prod.kg} kg</p>
          )}

          <p className="text-[#8F108D] font-semibold mb-3"> ${formatearPrecio(prod.precio)}</p>
       <button
       className="bg-[#8F108D] text-white text-sm md:text-md px-3 md:px-6 py-2 rounded hover:bg-purple-700 transition"
       onClick={() => {
        agregarAlCarrito(prod);
       toast(
      <div className="bg-white border-4 border-[#8F108D] text-[#8F108D] px-4 py-3 items-center text-center rounded-lg shadow-md  text-xs sm:text-sm 2xl:text-xl font-extrabold ">
       🐾 Muchisimas Gracias!! 
       Su Producto fue agregado al carrito 🐾 🛒 
      </div>
     ,{duration:2000,});
      }}
    >
      Comprar
     </button>
        </div>
      ))}
    </div>
  );
}
