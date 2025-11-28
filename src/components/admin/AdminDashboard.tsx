import { useState } from 'react';
import Sidebar from './Sidebar';
import SectionClientes from './SectionClientes';
import SectionEmpleados from './SectionEmpleados';
import SectionMascotas from './SectionMascotas';
import SectionTurnos from './SectionTurnos';
import SectionVentas from './SectionVentas';
import SectionChat from './SectionChat'; 

// 2. Extender el tipo AdminSection para incluir 'Chat'
export type AdminSection = 'Clientes' | 'Usuarios' | 'Empleados' | 'Mascotas' | 'Turnos' | 'Ventas' | 'Chat'; 

const AdminDashboard: React.FC = () => {
    // Inicializamos con 'Clientes', pero el tipo ahora incluye 'Chat'
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
            case 'Chat':
                return <SectionChat />; 
            default:
                return <SectionClientes />;
        }
    };

    return (
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