// Sidebar.tsx

import React from 'react';
import { 
  Users, 
  Heart, 
  Calendar, 
  ShoppingCart, 
  LogOut 
} from 'lucide-react'; // Eliminado MessageCircle

// 1. Importa el tipo desde el componente padre
// 1. Importa el tipo desde el componente padre
import type { AdminSection } from './AdminDashboard'; 

// 2. Interfaz de Props Corregida
interface SidebarProps {
  activeSection: AdminSection;
  setActiveSection: React.Dispatch<React.SetStateAction<AdminSection>>;
}

// 3. Opciones del Sidebar actualizadas (sin 'Chat')
const sidebarItems: { name: string; icon: React.ElementType; key: AdminSection }[] = [
  { name: 'Usuarios', icon: Users, key: 'Usuarios' },
  { name: 'Mascotas', icon: Heart, key: 'Mascotas' },
  { name: 'Turnos', icon: Calendar, key: 'Turnos' },
  { name: 'Ventas', icon: ShoppingCart, key: 'Ventas' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  
  const handleLogout = () => {
    // Aquí tu lógica para cerrar sesión
    console.log('Cerrando sesión...');
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl flex flex-col">
      <div className="p-6 border-b dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          Panel Admin
        </h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {sidebarItems.map((item) => {
          const isActive = activeSection === item.key;
          return (
            <button
              key={item.key}
              onClick={() => setActiveSection(item.key)}
              className={`
                flex items-center w-full px-4 py-3 rounded-lg transition-colors duration-200
                ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;