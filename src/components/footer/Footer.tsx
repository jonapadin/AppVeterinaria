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


 <footer
  className="relative hidden sm:flex w-full h-44 bg-[#8F108D] text-white items-center 
  md:px-[60px] lg:px-[150px] py-6"
>
  {/* Logo fijo */}
  <div
    className="
      absolute left-4 top-1/2 -translate-y-1/2
      
    "
  >
    <img
      src="../../assets/icons/logoVet.png"
      alt="Logo Veterinaria"
      className="
        w-20 h-auto
        md:w-36
        lg:w-40
        xl:w-48
      "
    />
  </div>

  {/* Contenido del footer */}
  <div className="flex w-full justify-evenly items-center pl-[150px] md:pl-[200px] lg:pl-[260px] lg:gap-6">
    <div
      className="flex flex-col items-center 
      md:text-xs lg:text-sm xl:text-lg
      font-lato font-bold text-center mx-auto"
    >
      <div className="text-center">
        <p>Copyright © | 2025 | VETERINARIA</p>
        <p>Todos los Derechos Reservados</p>
        <p>Diseño y Desarrollo por</p>
        <p>Jonathan Padin - Celeste Ruspil</p>
        <p>Nicolas Dume - Marina Briceño</p>
      </div>
    </div>

    <div
      className="flex flex-col items-start gap-1 
      text-sm md:text-base lg:text-sm xl:text-lg
      font-lato font-bold lg:pl-10  xl:pl-20 md:pl-15"
    >
      <div className="flex items-center gap-2">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BiLogoInstagramAlt className=" md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-8x l:h-8" />
        </a>
        <span>Veterinari.Ig</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillFacebook className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-8x l:h-8" />
        </a>
        <span>Veterinaria.FB</span>
      </div>

      <div className="flex items-center gap-2">
        <BiLogoGmail className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-8x l:h-8" />
        <span>veterinaria@gmail.com</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/2284557768"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BsWhatsapp className="md:w-5 md:h-5 lg:w-7 lg:h-7 xl:w-8x l:h-8 text-green-500" />
        </a>
        <span>2284557768</span>
      </div>
    </div>
  </div>
</footer>


</>
);
}
