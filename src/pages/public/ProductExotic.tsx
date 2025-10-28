import CategoriaNav from "../../components/navbar-categoria/NavbarCtegorias";


function ProductExoticPage() {
  return (
    <>
  <section className="relative w-full h-auto flex justify-center items-center overflow-hidden mt-[60px] md:mt-[95px] lg:mt-[95px]">
  <img
    src="../../assets/img/productos/productPerros/productoPerro.png"
    alt="banner-perro"
    className="w-full h-auto object-contain"
  />
</section>
    <CategoriaNav />  
    </>
  );
}

export default ProductExoticPage;