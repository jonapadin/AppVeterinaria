import { useState } from "react";
import CategoriaNav from "../../components/navbar-categoria/NavbarCategorias";

function ProductDogPage() {
  const [subcategoria, setSubcategoria] = useState<string>("");

  return (
    <>
      {/* Banner */}
      <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px] lg:mt-[95px]">
        <img
          src="../../assets/img/productos/productCat/banner-gato.avif"
          alt="banner-perro"
          className="w-full h-auto object-contain"
        />
      </section>

      {/* Navbar de categorías */}
      <CategoriaNav onSelectSubcategoria={setSubcategoria} />

      {/* Contenido filtrado */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">
          {subcategoria
            ? `Productos de Perro - ${subcategoria}`
            : "Todos los productos de Perro"}
        </h2>

        {/* Aquí mostrarías los productos filtrados según la subcategoría */}
      </section>
    </>
  );
}

export default ProductDogPage;
