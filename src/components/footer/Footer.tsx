import { VscAccount, VscHome } from "react-icons/vsc";
import { BsCart, BsWhatsapp } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { BiLogoGmail, BiLogoInstagramAlt } from "react-icons/bi";

export default function Footer() {
  return (
    <>
      {/* Footer para móvil */}
      <footer className="sm:hidden fixed md:static bottom-0 w-full h-20 bg-[#8F108D] z-40">
        <ul className="grid grid-cols-3 h-full m-0 p-2 gap-10">
          <li className="flex flex-col items-center justify-center">
            <a href="/" className="flex flex-col items-center justify-center h-full" title="Inicio">
              <VscHome className="w-8 h-8 text-white" />
              <span className="text-white text-[15px] mt-1">INICIO</span>
            </a>
          </li>
          <li className="flex flex-col items-center justify-center">
            <a href="/l" className="flex flex-col items-center justify-center h-full" title="Ingresar">
              <VscAccount className="w-8 h-8 text-white" />
              <span className="text-white text-[15px] mt-1">INGRESAR</span>
            </a>
          </li>
          <li className="flex flex-col items-center justify-center">
            <a href="/" className="flex flex-col items-center justify-center h-full" title="Carrito">
              <BsCart className="w-8 h-8 text-white" />
              <span className="text-white text-[15px] mt-1">CARRITO</span>
            </a>
          </li>
        </ul>
      </footer>

<footer className="hidden sm:flex w-full h-44 bg-[#8F108D] text-white items-center md:px-[60px] lg:px-[150px]">


  {/* Logo fijo */}
  <div className="absolute  md:left-8 lg:left-14 pl-20 ">
    <img 
      src="../../assets/icons/logoVet.png" 
      alt="Logo Veterinaria" 
      className="w-30 h-15 md:w-60 md:h-30 lg:w-50 lg:h-30" 
    />
  </div>

 
  <div className="flex w-full justify-between items-center pl-[150px] md:pl-[200px] lg:pl-[260px]">
<div className="flex flex-col items-center pt-4 gap-1
                text-sm md:text-base lg:text-sm xl:text-lg
                font-lato font-bold text-center mx-auto">

      <div className="text-center">
  <p>Copyright © | 2025 | VETERINARIA</p>
  <p>Todos los Derechos Reservados</p>
  <p>Diseño y Desarrollo por</p>
  <p>Jonathan Padin -Celeste Ruspil</p>
  <p>Nicolas Dume - Marina Briceño</p>
</div>
    </div>

   <div className="flex flex-col items-start gap-1 text-sm md:text-base lg:text-sm xl:text-lg
font-lato font-bold ">
      
      <div className="flex items-center gap-2">
        <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
          <BiLogoInstagramAlt className="w-8 h-8" />
        </a>
             <span>Veterinari.Ig  </span>
             </div>
          <div className="flex items-center gap-2">        

        <a href="https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
          <AiFillFacebook className="w-8 h-8" />
        </a>
        <span>Veterinaria.FB   </span>
      </div>

      <div className="flex items-center gap-2">
        <BiLogoGmail className="w-8 h-8" />
        <span>veterinaria@gmail.com</span>
      </div>

      <div className="flex items-center gap-2">
        <a href="https://wa.me/2284557768" target="_blank" rel="noopener noreferrer">
          <BsWhatsapp className="w-8 h-8 text-green-500" />
        </a>
        <span>2284557768</span>
      </div>

    </div>

  </div>

</footer>
</>
);
}
