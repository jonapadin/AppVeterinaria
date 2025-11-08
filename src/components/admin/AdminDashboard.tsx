// AdminDashboard.tsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import SectionClientes from './SectionClientes'; // Renombrado
import SectionEmpleados from './SectionEmpleados'; // Nuevo
import SectionMascotas from './SectionMascotas';
import SectionTurnos from './SectionTurnos';
import SectionVentas from './SectionVentas';

// 1. Tipo de sección actualizado
export type AdminSection = 'Clientes' | 'Empleados' | 'Mascotas' | 'Turnos' | 'Ventas';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AdminSection>('Clientes');

  const renderSection = () => {
    switch (activeSection) {
      case 'Clientes':
        return <SectionClientes />;
      case 'Empleados':
        return <SectionEmpleados />;
      case 'Mascotas':
        return <SectionMascotas />;
      case 'Turnos':
        return <SectionTurnos />;
      case 'Ventas':
        return <SectionVentas />;
      default:
        return <SectionClientes />;
    }
  };

  return (
    // Fondo claro
    <div className="flex bg-gray-100 pt-28 h-screen">
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