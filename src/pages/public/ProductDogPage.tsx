import { useParams } from "react-router-dom";
import CategoriaNav from "../../components/navbar-categoria/NavbarCtegorias";

function ProductDogPage() {
  const { subcategoria } = useParams<{ subcategoria: string }>();

  return (
    <>
      {/* Banner */}
      <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px] lg:mt-[100spx] xl:mt-[110px]">
        <img
          src="../../assets/img/productos/productDog/banner-dog.png"
          alt="banner-perro"
          className="w-full h-auto object-contain"
        />
      </section>

      {/* Navbar de categorías */}
      <CategoriaNav />  

      {/* Contenido filtrado según subcategoría */}
      <section className="py-8 px-4">
        <h2 className="text-2xl font-bold mb-4">
          {subcategoria ? `Productos de Perro - ${subcategoria}` : ""}
        </h2>

      </section>
    </>
  );
}

export default ProductDogPage;
