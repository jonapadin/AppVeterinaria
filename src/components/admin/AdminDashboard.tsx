// AdminDashboard.tsx

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SectionUsuarios from './SectionUsuarios';
import SectionMascotas from './SectionMascotas';
import SectionTurnos from './SectionTurnos';
import SectionVentas from './SectionVentas';

// 1. Tipo de sección actualizado (sin 'Chat')
export type AdminSection = 'Usuarios' | 'Mascotas' | 'Turnos' | 'Ventas';

const AdminDashboard: React.FC = () => {
  // Estado para saber qué sección está activa
  const [activeSection, setActiveSection] = useState<AdminSection>('Usuarios');

  // Función para renderizar la sección correcta
  const renderSection = () => {
    switch (activeSection) {
      case 'Usuarios':
        return <SectionUsuarios />;
      case 'Mascotas':
        return <SectionMascotas />;
      case 'Turnos':
        return <SectionTurnos />;
      case 'Ventas':
        return <SectionVentas />;
      default:
        return <SectionUsuarios />; // Por defecto muestra Usuarios
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        setActiveSection={setActiveSection} 
      />

      {/* Contenido Principal */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {renderSection()}
      </main>
    </div>
  );
};

export default AdminDashboard;