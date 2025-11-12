import { useState } from "react";
import CategoriaNav from "../../components/navbar-categoria/NavbarCategorias";
import FiltroProductos from "../../components/producto/FiltroProducto";
import OrdenarProductos from "../../components/producto/OrdenarProductos";
import ProductList from "../../components/producto/ProductoLista";

function ProductExoticPage() {
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
      <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px]">
        <img
          src="../../assets/img/productos/productDog/banner-dog.png"
          alt="banner-Exotico"
          className="w-full h-auto object-contain"
        />
      </section>

      <CategoriaNav
        onSelectSubcategoria={setSubcategoria}
        categoriaActual="Exoticos"
      />

      <div className="flex flex-col md:flex-row gap-6 p-6">
        <div className="w-full md:w-1/4 hidden md:block">
          <FiltroProductos
            categoriaActual="Exoticos"
            subcategoriaActual={subcategoria}
            onSelectSubcategoria={setSubcategoria}
            onChange={setFiltros}
          />
        </div>

        <div className="flex-1 flex flex-col gap-4">
          <div className="hidden md:flex justify-end mb-4">
            <OrdenarProductos orden={orden} onChange={setOrden} />
          </div>

          <ProductList
            categoria="Exoticos"
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

export default ProductExoticPage;
