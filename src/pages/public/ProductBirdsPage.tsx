

import { useState } from "react";
import CategoriaNav from "../../components/navbar-categoria/NavbarCategorias";
import FiltroProductos from "../../components/producto/FiltroProducto";
import OrdenarProductos from "../../components/producto/OrdenarProductos";
import ProductList from "../../components/producto/ProductoLista";

function ProductBirdsPage() {
  const [subcategoria, setSubcategoria] = useState<string>("Alimento");
  const [filtros, setFiltros] = useState({
    presentaciones: [] as string[],
    marcas: [] as string[],
  });
  const [orden, setOrden] = useState<
    "mas-vendidos" | "menor-mayor" | "mayor-menor" | "a-z" | "z-a"
  >("mas-vendidos");

  return (
    <>
      {/* Banner */}
<section className="w-full mt-[60px] md:mt-[95px]">
  <div className="flex justify-center w-full">
    <img
      src="/assets/img/banner-product/banner-brirds.jpg"
      alt="banner-aves"
      className="object-contain h-auto w-auto max-w-full"
    />
  </div>
</section>
  
      {/* Categorías */}
      <CategoriaNav
        onSelectSubcategoria={setSubcategoria}
        categoriaActual="Aves"
      />

      <div className="flex flex-col md:flex-row gap-6 p-6">

        {/* FILTROS PC */}
        <div className="w-full md:w-1/4 hidden md:block">
          <FiltroProductos
            categoriaActual="Aves"
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
            categoria="Aves"
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

export default ProductBirdsPage;
