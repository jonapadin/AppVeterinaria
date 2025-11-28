// Sidebar.tsx
import React from 'react';
import { 
  Users, // Para Clientes
  Briefcase, // Para Empleados
  Heart, 
  Calendar, 
  ShoppingCart, 
  MessageSquare, // ⬅️ 1. Importar ícono para Chat
} from 'lucide-react';
// ⚠️ Nota: Asumo que debes importar el tipo AdminSection desde el archivo AdminDashboard,
// pero el tipo debe ser extendido para incluir 'Chat'. 
// Lo hacemos aquí o en AdminDashboard.tsx.
import type { AdminSection } from './AdminDashboard'; 


// 2. Extender el tipo AdminSection
// (Si AdminDashboard está en otro archivo, DEBES agregar ' | "Chat"' a la definición de AdminSection allí).
// Ejemplo si estuviera en este mismo archivo:
// type AdminSection = 'Clientes' | 'Empleados' | 'Mascotas' | 'Turnos' | 'Ventas' | 'Chat';

interface SidebarProps {
  activeSection: AdminSection;
  setActiveSection: React.Dispatch<React.SetStateAction<AdminSection>>;
}

// 3. Agregar el nuevo item de Chat
const sidebarItems: { name: string; icon: React.ElementType; key: AdminSection }[] = [
  { name: 'Clientes', icon: Users, key: 'Clientes' },
  { name: 'Empleados', icon: Briefcase, key: 'Empleados' },
  { name: 'Mascotas', icon: Heart, key: 'Mascotas' },
  { name: 'Turnos', icon: Calendar, key: 'Turnos' },
  { name: 'Ventas', icon: ShoppingCart, key: 'Ventas' },
  { name: 'Chat', icon: MessageSquare, key: 'Chat' }, // ⬅️ Nuevo item de Chat
];

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  

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