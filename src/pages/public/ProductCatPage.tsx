import { useState } from "react";
import NavbarCategorias from "../../components/navbar-categoria/NavbarCategorias";
import FiltroProductos from "../../components/producto/FiltroProducto";
import OrdenarProductos from "../../components/producto/OrdenarProductos";
import ProductList from "../../components/producto/ProductoLista";
import { useProductos } from "../../components/producto/Fetch";
import type { Producto } from "../../components/producto/Fetch";

function ProductCatPage() {
  const { productos, loading } = useProductos();

  const [subcategoria, setSubcategoria] = useState<string>("Alimento");
  const [filtros, setFiltros] = useState({
    presentaciones: [] as string[],
    marcas: [] as string[],
  });
  const [orden, setOrden] = useState<"menor-mayor" | "mayor-menor" | "a-z" | "z-a">(
    "menor-mayor"
  );

  return (
    <>
      {/* Banner */}
      <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px]">
        <img
          src="/assets/img/banner-product/banner-gato.avif"
          alt="banner-gatos"
          className="w-full h-auto object-contain"
        />
      </section>

      {/* Navbar de categorías */}
      <NavbarCategorias
        categoriaActual="Gato"
        productos={productos}
        onSelectSubcategoria={setSubcategoria}
      />

      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* FILTROS PC */}
        <div className="w-full md:w-1/4 hidden md:block">
          <FiltroProductos
            productos={productos}
            categoriaActual="Gato"
            subcategoriaActual={subcategoria}
            onSelectSubcategoria={setSubcategoria}
            onChange={setFiltros}
          />
        </div>

        {/* PRODUCTOS */}
        <div className="flex-1 flex flex-col gap-4">
          {/* ORDENAR SOLO PC */}
          <div className="hidden md:flex justify-end mb-4">
            <OrdenarProductos orden={orden} onChange={setOrden} />
          </div>

          <ProductList
            categoria="Gato"
            subcategoria={subcategoria}
            filtros={filtros}
            orden={orden}
            setOrden={setOrden}
          />
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-4">Cargando productos...</p>
      )}
    </>
  );
}

export default ProductCatPage;
