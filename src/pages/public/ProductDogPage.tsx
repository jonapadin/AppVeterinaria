import { useState, useEffect } from "react";
import NavbarCategorias from "../../components/navbar-categoria/NavbarCategorias";
import FiltroProductos from "../../components/producto/FiltroProducto";
import OrdenarProductos from "../../components/producto/OrdenarProductos";
import ProductList from "../../components/producto/ProductoLista";
import { useProductos } from "../../components/producto/Fetch";

function ProductDogPage() {
  const { productos, loading } = useProductos();

  const [subcategoria, setSubcategoria] = useState<string>("Alimento");
  const [filtros, setFiltros] = useState({
    presentaciones: [] as string[],
    marcas: [] as string[],
  });
  const [orden, setOrden] = useState<"menor-mayor" | "mayor-menor" | "a-z" | "z-a">(
    "menor-mayor"
  );

  // Este efecto fuerza que la subcategoría inicial se aplique
  // después de que los productos carguen
  useEffect(() => {
    if (productos.length > 0) {
      setSubcategoria("Alimento");
    }
  }, [productos]);

  return (
    <>
      {/* Banner */}
      <section className="w-full">
        <div className="h-[180px] sm:h-[250px] md:h-[300px] lg:h-[700px] overflow-hidden">
          <img
            src="/assets/img/banner-product/banner-dog.png"
            alt="banner-perro"
            className="w-full h-full object-top"
          />
        </div>
      </section>

      {/* Navbar de categorías */}
      <NavbarCategorias
        categoriaActual="Perro"
        productos={productos}
        onSelectSubcategoria={setSubcategoria}
      />

      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* FILTROS PC */}
        <div className="w-full md:w-1/4 hidden md:block">
          <FiltroProductos
            productos={productos}
            categoriaActual="Perro"
            subcategoriaActual={subcategoria}
            onSelectSubcategoria={setSubcategoria}
            onChange={setFiltros}
          />
        </div>

        {/* PRODUCTOS */}
        <div className="flex-1 flex flex-col gap-4">
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

      {loading && <p className="text-center text-gray-500 mt-4">Cargando productos...</p>}
    </>
  );
}

export default ProductDogPage;
