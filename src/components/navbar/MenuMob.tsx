import { GoX } from "react-icons/go";

type MenuMob = {
  onClose: () => void;
};

export default function MenuMob({ onClose }: MenuMob) {
  return (
    <div className="fixed inset-0 bg-black/50 z-40 flex justify-end">
      {/* Menú lateral derecho */}
      <div className="bg-[#8F108D] text-white w-64 h-full p-6 shadow-lg">
        {/* Botón de cerrar */}
        <button onClick={onClose} className="mb-6 flex justify-end w-full">
          <GoX className="w-6 h-6" />
        </button>

        {/* Links */}
        <ul className="flex flex-col space-y-6 text-lg font-semibold">
          {["INICIO", "PRODUCTOS", "SERVICIOS", "CONTACTO"].map((item) => (
            <li
              key={item}
              className="hover:text-gray-200 cursor-pointer"
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
