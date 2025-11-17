// src/pages/productos/producto-perro/ProductDogPage.tsx

import { useState } from "react";
import CategoriaNav from "../../components/navbar-categoria/NavbarCategorias";
import FiltroProductos from "../../components/producto/FiltroProducto";
import OrdenarProductos from "../../components/producto/OrdenarProductos";
import ProductList from "../../components/producto/ProductoLista";

function ProductDogPage() {
  const [subcategoria, setSubcategoria] = useState<string>("Alimento");
  const [filtros, setFiltros] = useState({
    presentaciones: [] as string[],
    marcas: [] as string[],
  });
  const [orden, setOrden] = useState<
    "menor-mayor" | "mayor-menor" | "a-z" | "z-a"
  >("menor-mayor");

  return (
    <>
      {/* Banner */}
      <section className="w-full">
  <div className="h-[180px] sm:h-[250px] md:h-[300px] lg:h-[700px] pt-15 sm:pt-16 md:pt-20 xl:pt-20  overflow-hidden">
    <img
      src="/assets/img/banner-product/banner-dog.png"
      alt="banner-perro"
      className="w-full h-full object-top"
    />
  </div>
</section>

      {/* Categorías */}
      <CategoriaNav
        onSelectSubcategoria={setSubcategoria}
        categoriaActual="Perro"
      />

      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* FILTROS PC */}
        <div className="w-full md:w-1/4 hidden md:block">
          <FiltroProductos
            categoriaActual="Perro"
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
            categoria="Perro"
            subcategoria={subcategoria}
            filtros={filtros}
            orden={orden}
            setOrden={setOrden}
          />
        </div>
      </div>
    </>
  );
}

export default ProductDogPage;
