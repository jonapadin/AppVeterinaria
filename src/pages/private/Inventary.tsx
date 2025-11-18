/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
// SectionInventarioEmpleado.tsx
import React, { useState, useEffect } from 'react';
import { Archive, Plus } from 'lucide-react';
import { fetchApi } from '../../app/api'; 
// Importamos el Modal y las interfaces que ya definimos en SectionInventario.tsx
import { UsoInventarioModal } from '../../components/admin/SectionInventario'; 

// 🚨 SIMULACIÓN: HARDCODEAMOS EL ID DEL EMPLEADO LOGUEADO
// En una aplicación real, este ID vendría del contexto de autenticación o de una sesión.
const ID_EMPLEADO_LOGUEADO = 5; 

// Interfaz para Lookups
interface ItemLookup {
  id: number;
  nombre: string;
}

// Tipo de dato que espera el onSave del modal
interface CreateUsoInventarioDto {
  id_producto: number;
  id_empleado: number;
  fecha_uso: string;
}

const SectionInventarioEmpleado: React.FC = () => {
  const [productosLookup, setProductosLookup] = useState<ItemLookup[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Listas (Lookups) ---
  const cargarProductosLookup = async () => {
    setLoadingLookups(true);
    try {
      // Asumo que tu endpoint de Producto devuelve al menos {id, nombre}
      const productosData = await fetchApi('/productos');
      setProductosLookup(productosData.map((p: any) => ({ 
        id: p.id, 
        nombre: p.nombre 
      })));
    } catch (err) {
       setError(`Error al cargar la lista de productos: ${(err as Error).message}`);
    } finally {
      setLoadingLookups(false);
    }
  };

  useEffect(() => {
    cargarProductosLookup();
  }, []); 

  // --- Handlers de Modales ---
  // Solo tenemos función para abrir el modal de NUEVO uso
  const handleOpenModalNuevo = () => { 
    setIsModalOpen(true); 
  };
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
  };

  // --- Handler de Guardar (El corazón de la página del empleado) ---
  const handleSave = async (data: CreateUsoInventarioDto) => {
    // ⚠️ SOBRESCRIBIMOS el ID del Empleado con el del usuario logueado
    const dataToSend = {
      ...data,
      id_producto: Number(data.id_producto),
      id_empleado: ID_EMPLEADO_LOGUEADO, // FORZAMOS el ID del empleado
      fecha_uso: new Date(data.fecha_uso).toISOString(),
    };
    
    try {
      await fetchApi('/inventario/uso', { 
        method: 'POST', 
        body: JSON.stringify(dataToSend) 
      });
      alert('¡Uso de inventario registrado con éxito!');
      handleCloseModal();
      // Recargar lista de productos para ver el stock actualizado
      cargarProductosLookup(); 
    } catch (err) {
      alert(`Error al registrar el uso: ${(err as Error).message}`);
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">👋 ¡Hola Empleado {ID_EMPLEADO_LOGUEADO}!</h1>
      <h2 className="text-2xl text-gray-700">Registro Rápido de Consumo de Inventario</h2>
      
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <p className="text-gray-600">
          Utiliza esta herramienta para registrar inmediatamente los productos utilizados en tratamientos o servicios.
        </p>

        {loadingLookups ? (
            <div className="text-center text-primary-600">Cargando listas de productos...</div>
        ) : error ? (
            <div className="text-red-600 bg-red-100 p-3 rounded-lg">
                <strong>Error:</strong> {error}
            </div>
        ) : (
            <button 
                onClick={handleOpenModalNuevo} 
                className="btn-primary flex items-center justify-center w-full md:w-auto"
            >
                <Plus className="w-5 h-5 mr-2" />
                Registrar Nuevo Consumo
            </button>
        )}
      </div>
      
      {/* ⚠️ Muestra un resumen del STOCK actual (opcional pero útil) */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h3 className="text-xl font-medium mb-4 flex items-center"><Archive className="w-5 h-5 mr-2"/> Stock de Productos (Visión Rápida)</h3>
        {loadingLookups ? (
            <div className="text-center text-gray-500">Cargando stock...</div>
        ) : (
             <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {productosLookup.map((p) => (
                    <li key={p.id} className="p-3 border rounded-lg bg-gray-50">
                        <span className="font-semibold">{p.nombre}</span>
                        <br />
                        <span className="text-sm text-gray-600">ID: {p.id}</span>
                        {/* 🚨 NOTA: Para obtener el STOCK, necesitas llamar a /producto y filtrar. 
                           Aquí solo tenemos el nombre, pero en una app real, 
                           cargarías el objeto Producto completo para mostrar el stock aquí. */}
                    </li>
                ))}
            </ul>
        )}
      </div>

      {isModalOpen && (
        <UsoInventarioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={null} // Siempre es un registro nuevo para el empleado
          // Le pasamos el ID del empleado logueado para que NO aparezca en el desplegable
          empleados={[{ id: ID_EMPLEADO_LOGUEADO, nombre: `Tú (ID ${ID_EMPLEADO_LOGUEADO})` }]} 
          productos={productosLookup}
        />
      )}
    </div>
  );
};

export default SectionInventarioEmpleado;
