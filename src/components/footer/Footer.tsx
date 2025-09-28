import { VscAccount, VscHome } from "react-icons/vsc";
import { BsCart } from "react-icons/bs";

export default function Footer() {
  return (
    <>
  <footer className="sm:hidden fixed bottom-0 w-full h-20 bg-[#8F108D] z-50">
  <ul className="flex justify-around items-center h-full m-0 p-10">
    <li>
      <a href="/" className="flex flex-col items-center justify-center h-full" title="Inicio">
        <VscHome className="w-8 h-8 text-white" />
        <span className="text-white text-[15px] mt-1">INICIO</span>
      </a>
    </li>
    <li>
      <a href="/l" className="flex flex-col items-center justify-center h-full" title="Ingresar">
        <VscAccount className="w-8 h-8 text-white" />
        <span className="text-white text-[15px] mt-1">INGRESAR</span>
      </a>
    </li>
    
    <li>
      <a href="/" className="flex flex-col items-center justify-center h-full" title="Carrito">
        <BsCart className="w-8 h-8 text-white" />
        <span className="text-white text-[15px] mt-1">CARRITO</span>
      </a>
    </li>
  </ul>
</footer>

      {/*Footer para escritorio */}
      <footer className="hidden md:flex flex-col items-center mt-10">
        <img
          src="../../assets/icons/patitaGatoPerroLogo 2.svg"
          alt="patitas"
        />
        <ul className="flex gap-4 mt-4">
          <li>Inicio</li>
          <li>Servicios</li>
          <li>Contacto</li>
        </ul>
      </footer>
    </>
  );
}
