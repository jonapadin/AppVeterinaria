import { GoX } from "react-icons/go";

type MenuMob = {
  onClose: () => void;
    onOpenCarrito: () => void;
};

export default function MenuMob({ onClose }: MenuMob) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50  flex justify-start lg:hidden">
      {/* Menú lateral derecho */}
      <div className="bg-[#8F108D] text-white w-64 h-full p-6 shadow-lg z-[9999] ">
        <button onClick={onClose} className="flex justify-end w-full">
          <GoX className="w-6 h-6" />
        </button>
         <img src="../../assets/icons/logoVet.png" alt="Logo Veterinaria" className="w-40 h-20 mb-6 pl-3" />

        {/* Links */}
        <ul className="flex flex-col space-y-6 text-lg font-semibold">
          {["INICIO", "PRODUCTOS", "SERVICIOS", "CONTACTO", "INGRESAR"].map((item) => (
            <li
              key={item}
              className="cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105"
              onClick={onClose} 
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
