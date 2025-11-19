import { GoX } from "react-icons/go";
import { Link } from "react-router-dom"; 
import { FaHome, FaBox, FaTools } from "react-icons/fa"; 
import { FaCartShopping, FaRegCircleUser } from "react-icons/fa6"; 


type MenuItem = {
  name: string;
  path?: string; 
  isAction?: boolean; 
  // Icono como componente de React
  Icon: React.ElementType; 
};

type MenuMobProps = {
  onClose: () => void;
  onOpenCarrito: () => void;
};

const menuItems: MenuItem[] = [
  { name: "INICIO", path: "/", Icon: FaHome },
  { name: "PRODUCTOS", path: "/categoria", Icon: FaBox },
  { name: "SERVICIOS", path: "/services", Icon: FaTools },
  { name: "CARRITO", isAction: true, Icon: FaCartShopping },
  { name: "INGRESAR", path: "/login", Icon: FaRegCircleUser },
];

export default function MenuMob({ onClose, onOpenCarrito }: MenuMobProps) {
  
  const handleItemClick = (item: MenuItem) => {
    onClose(); 
    if (item.isAction) {
      onOpenCarrito(); 
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-start lg:hidden">
      <div className="bg-[#8F108D] text-white w-64 h-full p-6 shadow-lg z-[9999] ">
        <button onClick={onClose} className="flex justify-end w-full">
          <GoX className="w-6 h-6" />
        </button>
        <img src="../../assets/icons/logoVet.png" alt="Logo Veterinaria" className="w-40 h-20 mb-6 pl-3" />

        {/* Links, acciones */}
        <ul className="flex flex-col space-y-6 text-lg font-semibold">
          {menuItems.map((item) => {
            // Clases para que se vea el ícono y el texto alineado
            const commonClasses = "cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 flex items-center gap-2.5";

            if (item.isAction) {
              return (
                <li
                  key={item.name}
                  className={commonClasses}
                  onClick={() => handleItemClick(item)} 
                >
                  <item.Icon /> {item.name} 
                </li>
              );
            }

            // Ítem de navegación (<Link>)
            return (
              <Link
                key={item.name}
                to={item.path!} 
                className={commonClasses}
                onClick={() => handleItemClick(item)} 
              >
                <item.Icon /> {item.name} 
              </Link>
            );
          })}
        </ul>
      </div>
    </div>
  );
}