import { useState } from "react";
import CategoriaNav from "../../components/navbar-categoria/NavbarCategorias";
import ProductList from "../../components/producto/ProductoLista";

function ProductDogPage() {
  const [subcategoria, setSubcategoria] = useState<string>("Alimento");

  return (
    <>
      <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px] lg:mt-[95px]">
        <img
          src="../../assets/img/productos/productDog/banner-dog.png"
          alt="banner-perro"
          className="w-full h-auto object-contain"
        />
      </section>

      <CategoriaNav
        onSelectSubcategoria={setSubcategoria}
        categoriaActual="Perro"
      />

      <ProductList categoria="Perro" subcategoria={subcategoria} />
    </>
  );
}

export default ProductDogPage;
