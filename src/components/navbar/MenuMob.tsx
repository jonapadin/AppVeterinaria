import { GoX } from "react-icons/go";
import { Link } from "react-router-dom";
import { FaHome, FaBox, FaTools } from "react-icons/fa";
import { FaCartShopping, FaRegCircleUser, FaRightFromBracket } from "react-icons/fa6";


type MenuItem = {
  name: string;
  path?: string;
  isAction?: boolean;
  // Icono como componente de React
  Icon: React.ElementType;
  // Función de acción opcional para cerrar sesión
  onClick?: () => void;
};

type MenuMobProps = {
  onClose: () => void;
  onOpenCarrito: () => void;
  // Añadimos las props de autenticación que vienen de NavBar
  isAuthenticated: boolean;
  onLogout: () => void;
};

// Elementos de menú que son estáticos 
const baseMenuItems: MenuItem[] = [
  { name: "INICIO", path: "/", Icon: FaHome },
  { name: "PRODUCTOS", path: "/categoria", Icon: FaBox },
  { name: "SERVICIOS", path: "/services", Icon: FaTools },
  { name: "CARRITO", isAction: true, Icon: FaCartShopping },
];

export default function MenuMob({ onClose, onOpenCarrito, isAuthenticated, onLogout }: MenuMobProps) {

  // 1. Definimos el elemento condicional
  // Utilizamos las props isAuthenticated y onLogout
  const authItem: MenuItem = isAuthenticated
    ? {
      name: "CERRAR SESIÓN",
      isAction: true,
      Icon: FaRightFromBracket,
      onClick: onLogout // Ejecuta la función de logout que viene de NavBar
    }
    : {
      name: "INGRESAR",
      path: "/login",
      Icon: FaRegCircleUser
    };

  // Combinamos la lista base con el elemento de autenticación
  const menuItems: MenuItem[] = [...baseMenuItems, authItem];

  // Modificamos el manejador de clics para ejecutar la función onClick si existe
  const handleItemClick = (item: MenuItem) => {
    onClose();

    if (item.onClick) {
      // Si el ítem tiene una función onClick (CERRAR SESIÓN)
      item.onClick();
    } else if (item.isAction) {
      // Si es una acción genérica (CARRITO)
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
            const commonClasses = "cursor-pointer transition-all duration-300 hover:text-gray-200 hover:scale-105 flex items-center gap-2.5";

            // Si es una acción o tiene una función de click CARRITO o CERRAR SESIÓN
            // Se renderiza como <li> sin <Link>
            if (item.isAction || item.onClick) {
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