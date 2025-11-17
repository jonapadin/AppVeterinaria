// Sidebar.tsx
import React from 'react';
import { 
  Users, // Para Clientes
  User, // Para Usuarios
  Briefcase, // Para Empleados
  Heart, 
  Calendar, 
  ShoppingCart, 
  LogOut 
} from 'lucide-react';
import type { AdminSection } from './AdminDashboard'; 

interface SidebarProps {
  activeSection: AdminSection;
  setActiveSection: React.Dispatch<React.SetStateAction<AdminSection>>;
}

const sidebarItems: { name: string; icon: React.ElementType; key: AdminSection }[] = [
  { name: 'Clientes', icon: Users, key: 'Clientes' },
  { name: 'Usuarios', icon: User, key: 'Usuarios' },
  { name: 'Empleados', icon: Briefcase, key: 'Empleados' },
  { name: 'Mascotas', icon: Heart, key: 'Mascotas' },
  { name: 'Turnos', icon: Calendar, key: 'Turnos' },
  { name: 'Ventas', icon: ShoppingCart, key: 'Ventas' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  
  const handleLogout = () => {
    console.log('Cerrando sesión...');
  };

  return (
    // Fondo claro y color primario
    <aside className="w-64 bg-white shadow-xl flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">
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
                    // Color primario para el activo
                    ? 'bg-primary text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              <item.icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;