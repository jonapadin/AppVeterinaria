import { useState } from "react";
import CategoriaNav from "../../components/navbar-categoria/NavbarCategorias";
import ProductList from "../../components/producto/ProductoLista";

function ProductCatPage() {
  const [subcategoria, setSubcategoria] = useState<string>("Alimento");

  return (
    <>
      {/* Banner */}
      <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px] lg:mt-[95px]">
        <img
          src="../../assets/img/productos/productCat/banner-gato.avif"
          alt="banner-gato"
          className="w-full h-auto object-contain"
        />
      </section>

      {/* Navbar de categorías */}
      <CategoriaNav
        onSelectSubcategoria={setSubcategoria}
        categoriaActual="Gato"
      />

      {/* Lista de productos */}
      <ProductList categoria="Gato" subcategoria={subcategoria} />
    </>
  );
}

export default ProductCatPage;
