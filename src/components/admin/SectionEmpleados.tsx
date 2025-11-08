/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
// SectionEmpleados.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api'; // Importa el helper

// 1. Interfaz EMPLEADO
interface Empleado {
  id: number;
  email: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: number;
  telefono: string;
  ciudad: string;
  direccion: string;
  especialidad: string;
}
// 2. DTO de Creación
type CreateEmpleadoDto = Omit<Empleado, 'id'> & { contrasena: string };

const SectionEmpleados: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Empleado | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Datos ---
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // CORREGIDO: Endpoint singular '/empleado'
      const data = await fetchApi('/empleado'); 
      setEmpleados(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // --- Filtros ---
  const empleadosFiltrados = useMemo(() => {
    return empleados.filter((e) =>
        (e.nombre.toLowerCase() + " " + e.apellido.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        e.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.especialidad.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [empleados, searchTerm]);

  // --- Handlers de Modales ---
  const handleOpenModalNuevo = () => {
    setItemParaEditar(null); 
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (item: Empleado) => {
    setItemParaEditar(item);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemParaEditar(null);
  };

  // --- Handlers de CRUD ---
  const handleSave = async (data: CreateEmpleadoDto | Omit<Empleado, 'id'>) => {
    try {
      if (itemParaEditar) {
        // CORREGIDO: Endpoint singular
        await fetchApi(`/empleado/${itemParaEditar.id}`, { method: 'PUT', body: JSON.stringify(data) });
      } else {
        // CORREGIDO: Endpoint singular
        await fetchApi('/empleado', { method: 'POST', body: JSON.stringify(data) });
      }
      handleCloseModal();
      cargarDatos();
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este empleado?')) {
      try {
        // CORREGIDO: Endpoint singular
        await fetchApi(`/empleado/${id}`, { method: 'DELETE' });
        cargarDatos();
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Empleados</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por Nombre, Email, Especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button onClick={handleOpenModalNuevo} className="btn-primary flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Empleado
          </button>
        </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4"><strong>Error:</strong> {error}</div>}

        {/* Tabla de Empleados */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">Email</th>
                <th className="th-cell">Especialidad</th>
                <th className="th-cell">Teléfono</th>
                <th className="th-cell">DNI</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={6} className="td-center">Cargando empleados...</td></tr>
              ) : empleadosFiltrados.length === 0 ? (
                 <tr><td colSpan={6} className="td-center">No se encontraron empleados.</td></tr>
              ) : (
                empleadosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{item.nombre} {item.apellido}</td>
                    <td className="td-cell">{item.email}</td>
                    <td className="td-cell">{item.especialidad}</td>
                    <td className="td-cell">{item.telefono}</td>
                    <td className="td-cell">{item.dni}</td>
                    <td className="td-cell text-right space-x-2">
                      <button onClick={() => handleOpenModalEditar(item)} className="text-primary hover:text-primary-700" data-tooltip-id="tooltip-main" data-tooltip-content="Editar">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-800" data-tooltip-id="tooltip-main" data-tooltip-content="Eliminar">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <EmpleadoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={itemParaEditar}
        />
      )}
      <Tooltip id="tooltip-main" />
    </div>
  );
};
export default SectionEmpleados;

// --- MODAL (EmpleadoModal) ---
interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEmpleadoDto | Omit<Empleado, 'id'>) => void;
  initialData: Empleado | null; 
}

const formatToInputDate = (isoString: string | undefined) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

const EmpleadoModal: React.FC<EmpleadoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    contrasena: '',
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    fecha_nacimiento: formatToInputDate(initialData?.fecha_nacimiento),
    dni: initialData?.dni || '',
    telefono: initialData?.telefono || '',
    ciudad: initialData?.ciudad || '',
    direccion: initialData?.direccion || '',
    especialidad: initialData?.especialidad || 'Administrador',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let dataToSend: any = { ...formData };
    dataToSend.dni = Number(dataToSend.dni);
    dataToSend.fecha_nacimiento = `${formData.fecha_nacimiento}T00:00:00Z`;

    if (initialData) {
      delete dataToSend.contrasena;
      onSave(dataToSend as Omit<Empleado, 'id'>);
    } else {
      if (!formData.contrasena) {
        alert('La contraseña es requerida para crear un nuevo empleado.');
        return;
      }
      onSave(dataToSend as CreateEmpleadoDto);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Empleado' : 'Agregar Empleado'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Fila 1: Nombre, Apellido, DNI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-tailwind">Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">Apellido</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">DNI</label>
              <input type="number" name="dni" value={formData.dni} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
          </div>

          {/* Fila 2: Email y Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            {!initialData && (
              <div>
                <label className="label-tailwind">Contraseña</label>
                <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
              </div>
            )}
          </div>
          
          {/* Fila 3: Especialidad */}
          <div>
            <label className="label-tailwind">Especialidad</label>
            <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
          </div>

          {/* Fila 4: Teléfono, Fecha Nacimiento, Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-tailwind">Teléfono</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
             <div>
              <label className="label-tailwind">Fecha Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
             <div>
              <label className="label-tailwind">Ciudad</label>
              <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
          </div>

          {/* Fila 5: Dirección */}
          <div>
            <label className="label-tailwind">Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 w-full input-tailwind" />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};