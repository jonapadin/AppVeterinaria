import { VscAccount, VscHome } from "react-icons/vsc";
import { BsCart, BsWhatsapp } from "react-icons/bs";
import { AiFillFacebook } from "react-icons/ai";
import { BiLogoGmail, BiLogoInstagramAlt } from "react-icons/bi";

export default function Footer() {
  return (
    <>
      {/* Footer para móvil */}
      <footer className="sm:hidden fixed bottom-0 w-full h-20 bg-[#8F108D] z-50">
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

      {/* Footer para escritorio */}
      <footer className="hidden sm:flex fixed bottom-0 left-0 w-full h-45 bg-[#8F108D] text-white">
        <div className="flex items-centerl ">
          <img src="../../assets/icons/logoVet.png" alt="Logo Veterinaria" className="w-60 h-30 mt-4" />
        </div>

        <ul className="flex flex-col items-center ml-auto pt-4 gap-1 text-lg font-lato font-bold">
          <li><a href="/">Inicio</a></li>
          <li><a href="/servicios">Servicio</a></li>
          <li><a href="/productos">Producto</a></li>
          <li><a href="/carrito">Carrito</a></li>
          <li><a href="/login">Ingresar</a></li>
        </ul>

        <div className="flex flex-col items-center ml-auto -mt-12 p-15 text-lg  font-lato font-bold">
          <span>Veterinaria</span>
          <span>veterinaria@gmail.com</span>
          <div className="flex gap-4 mt-2">
            <a href=" https://www.facebook.com/" target="_blank" rel="noopener noreferrer">
              <AiFillFacebook className="w-8 h-8 text-shadow-cyan-400" />
            </a>

            <a href="mailto:veterinaria@gmail.com">
              <BiLogoGmail className="w-8 h-8 text-white" />
            </a>

            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
              <BiLogoInstagramAlt className="w-8 h-8 text-shadow-fuchsia-500" />
            </a></div>

          <div className="flex items-center gap-2 mt-1">
            <a href="https://wa.me/2284557768" target="_blank" rel="noopener noreferrer">
              <BsWhatsapp className="w-8 h-8 text-green-500" /></a>
              <span>2284557768</span>
             </div>
        </div>
      </footer>
    </>
  );
}
