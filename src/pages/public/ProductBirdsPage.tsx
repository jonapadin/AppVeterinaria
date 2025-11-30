
// src/pages/public/ProductDogPage.tsx
import { useState, useEffect } from "react";
import NavbarCategorias from "../../components/navbar-categoria/NavbarCategorias";
import FiltroProductos from "../../components/producto/FiltroProducto";
import OrdenarProductos from "../../components/producto/OrdenarProductos";
import ProductList from "../../components/producto/ProductoLista";
import Paginator from "../../components/producto/Paginador";
import { useProductos } from "../../components/producto/Fetch";
import type { CategoriaProducto } from "../../enums/categoriaProductos";
import { SubcategoriaProducto } from "../../enums/subCategoriaProductos";

function ProductBirdsPage() {
  const { productos, loading } = useProductos();

  const [subcategoria, setSubcategoria] = useState<SubcategoriaProducto>(
    SubcategoriaProducto.ALIMENTOS
  );

  const [filtros, setFiltros] = useState({
    presentaciones: [] as string[],
    marcas: [] as string[],
  });

  const [orden, setOrden] = useState<
    "menor-mayor" | "mayor-menor" | "a-z" | "z-a"
  >("menor-mayor");

  const [currentPage, setCurrentPage] = useState<number>(1);
  const productsPerPage = 8; // cantidad de productos por página

  // Forzar subcategoría ALIMENTOS cuando los productos carguen
  useEffect(() => {
    if (productos.length > 0) {
      setSubcategoria(SubcategoriaProducto.ALIMENTOS);
    }
  }, [productos]);

  // Filtrar productos según subcategoría y filtros
  const productosFiltrados = productos.filter(
    (p) =>
      p.categoria === ("Ave" as CategoriaProducto) &&
      p.subcategoria === subcategoria &&
      (filtros.marcas.length === 0 || filtros.marcas.includes(p.marca)) &&
      (filtros.presentaciones.length === 0 ||
        filtros.presentaciones.some((k) => parseFloat(k) === p.kg))
  );

  // Ordenar productos
  const productosOrdenados = [...productosFiltrados].sort((a, b) => {
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

  // Paginación
  const totalPages = Math.ceil(productosOrdenados.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = productosOrdenados.slice(indexOfFirst, indexOfLast);

  return (
    <>
      {/* Banner */}
      <section className="w-full">
        <div className="h-[180px] sm:h-[250px] md:h-[300px] lg:h-[700px] overflow-hidden pt-12 md:pt-18 2xl:pt-18">
          <img
            src="/assets/img/banner-product/banner-aves.jpg"
            alt="banner-aves"
            className="w-full h-full object-top"
          />
        </div>
      </section>

      {/* Navbar de categorías */}
    
      {/* Navbar de categorías */}
      <NavbarCategorias
        categoriaActual="Ave"
        productos={productos}
        onSelectSubcategoria={(sub) =>
          setSubcategoria(sub as SubcategoriaProducto)
        }
      />
    {/* FILTROS MOBILE */}
<div className="block md:hidden px-6">
  <FiltroProductos
    productos={productos}
    categoriaActual={"Perro" as CategoriaProducto}
    subcategoriaActual={subcategoria}
    onSelectSubcategoria={(sub) =>
      setSubcategoria(sub as SubcategoriaProducto)
    }
    onChange={setFiltros}
  />
</div>

<div className="flex flex-col md:flex-row gap-6 p-6"></div>

      <div className="flex flex-col md:flex-row gap-6 p-6">
        {/* FILTROS PC */}
        <div className="w-full md:w-1/4 hidden md:block">
          <FiltroProductos
            productos={productos}
            categoriaActual={"Perro" as CategoriaProducto}
            subcategoriaActual={subcategoria}
            onSelectSubcategoria={(sub) =>
              setSubcategoria(sub as SubcategoriaProducto)
            }
            onChange={setFiltros}
          />
        </div>

        {/* PRODUCTOS */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Orden */}
          <div className="hidden md:flex justify-end mb-4">
            <OrdenarProductos orden={orden} onChange={setOrden} />
          </div>

          {/* Lista de productos */}
          <ProductList
            categoria={"Ave" as CategoriaProducto}
            subcategoria={subcategoria}
            filtros={filtros}
            orden={orden}
          
            productos={currentProducts}
          />

          {/* Paginador */}
          <Paginator
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </div>

      {loading && (
        <p className="text-center text-gray-500 mt-4">Cargando productos...</p>
      )}
    </>
  );
}



export default ProductBirdsPage;
