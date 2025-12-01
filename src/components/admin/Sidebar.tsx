import React from 'react';
import { 
  Users, 
  Briefcase, 
  Heart, 
  Calendar, 
  ShoppingCart, 
  MessageSquare, 
  Package,
} from 'lucide-react';
import type { AdminSection } from './AdminDashboard'; 


interface SidebarProps {
  activeSection: AdminSection;
  setActiveSection: React.Dispatch<React.SetStateAction<AdminSection>>;
}

// Agregar el nuevo item de Chat
const sidebarItems: { name: string; icon: React.ElementType; key: AdminSection }[] = [
  { name: 'Clientes', icon: Users, key: 'Clientes' },
  { name: 'Empleados', icon: Briefcase, key: 'Empleados' },
  { name: 'Mascotas', icon: Heart, key: 'Mascotas' },
  { name: 'Turnos', icon: Calendar, key: 'Turnos' },
  { name: 'Ventas', icon: ShoppingCart, key: 'Ventas' },
  { name: 'Chat', icon: MessageSquare, key: 'Chat' }, // 
  { name: 'Inventario', icon: Package, key: 'Inventario' },
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  

  return (
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
                    ? 'bg-primary text-black shadow-lg' 
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

      
    </aside>
  );
};

export default Sidebar;