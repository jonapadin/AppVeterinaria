import { VscAccount, VscHome } from "react-icons/vsc";
import { BsCart, BsWhatsapp } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { BiLogoGmail, BiLogoInstagramAlt } from "react-icons/bi";
import { Link } from "react-router-dom";

interface FooterProps {
  onOpenCarrito: () => void;
}
export default function Footer({ onOpenCarrito }: FooterProps) {
  // Obtener el token. 
  const token = localStorage.getItem("token");
  
  return (
    <>
      {/* Footer para móvil */}
      <footer className="sm:hidden fixed md:static bottom-0 w-full h-20 bg-[#8F108D] z-40">
        <ul className="grid grid-cols-3 h-full m-0 p-2 gap-10">
         <li className="flex flex-col items-center justify-center">
     <Link to="/" className="flex flex-col items-center justify-center h-full" title="Inicio"
  >
    <VscHome className="w-8 h-8 text-white" />
    <span className="text-white text-[15px] mt-1">INICIO</span>
  </Link>
</li>
{ token ? (
<li className="flex flex-col items-center justify-center">
  <Link
    to="/user/profile"
    className="flex flex-col items-center justify-center h-full"
    title="Ingresar"
  >
    
    <VscAccount className="w-8 h-8 text-white" />
    <span className="text-white text-[15px] mt-1">MI PERFIL</span>
  </Link>
</li>
) : 
(
  <li className="flex flex-col items-center justify-center">
  <Link
    to="login"
    className="flex flex-col items-center justify-center h-full"
    title="Ingresar"
  >
    
    <VscAccount className="w-8 h-8 text-white" />
    <span className="text-white text-[15px] mt-1">INGRESAR</span>
  </Link>
</li>
)}

  
        
      {/* CARRO MOBILE */}
           <li className="flex flex-col items-center justify-center">
  <button
    onClick={onOpenCarrito}
    className="flex flex-col items-center justify-center h-full"
    title="Carrito"
  >
    <BsCart className="w-8 h-8 text-white" />
    <span className="text-white text-[15px] mt-1">CARRITO</span>
  </button>

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
      src="../../assets/icons/iconosVet.png"
      alt="Logo Veterinaria"
      className="
        w-20 h-auto
        md:w-36
        lg:w-40
        xl:w-48
        2xl:w-55
      "
    />
  </div>

  {/* Contenido del footer */}
  <div className="flex w-full  items-center pl-[150px] md:pl-[200px] lg:pl-[260px] ">
    <div
      className="flex flex-col items-center 
      md:text-xs lg:text-xs xl:text-sm 2xl:text-lg
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
      className="flex flex-col items-baseline gap-1
      text-xs md:text-sm lg:text-xs xl:text-lg 2xl:text-lg
      font-lato font-bold "
    >
      <div className="flex items-center gap-2">
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BiLogoInstagramAlt className=" md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-6 xl:h-6 ml-20" />
        </a>
        <span>HappyPaws.Ig</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://www.facebook.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <AiFillFacebook className="md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-6 xl:h-6 ml-20" />
        </a>
        <span>HappyPaws.FB</span>
      </div>

      <div className="flex items-center gap-2">
        <BiLogoGmail className="md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-6 xl:h-6 ml-20" />
        <span>info@happypaws.com</span>
      </div>

      <div className="flex items-center gap-2">
        <a
          href="https://wa.me/2284557768"
          target="_blank"
          rel="noopener noreferrer"
        >
          <BsWhatsapp className="md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-6 xl:h-6 text-green-500 ml-20" />
        </a>
        <span>228412345678</span>
      </div>
    </div>
  </div>
</footer>


</>
);
}
