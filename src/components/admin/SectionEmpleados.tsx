import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip'; 
import { fetchApi } from '../../app/api'; 

// INTERFACES 
interface Usuario {
  id: number;
  email: string;
  contrasena?: string;
  rol: string;
  fechaRegistro: string;
  estado: string;
}

interface Empleado {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: number;
  telefono: string;
  ciudad: string;
  direccion: string;
  especialidad: string;
  usuario: Usuario; 
}

type CreateEmpleadoDto = Omit<Empleado, 'id' | 'usuario'> & { 
    email: string;
    contrasena: string;
};

type UpdateEmpleadoDto = Omit<Empleado, 'id' | 'usuario'>;


// MODAL (EmpleadoModal) 
interface EmpleadoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEmpleadoDto | UpdateEmpleadoDto) => void; 
  initialData: Empleado | null; 
}

const formatToInputDate = (isoString: string | undefined) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

const EmpleadoModal: React.FC<EmpleadoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [errorModal, setErrorModal] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    // Inicialización del email con el email del usuario anidado
    email: initialData?.usuario.email || '', 
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

  // Resetear formulario si cambian los datos iniciales o se abre/cierra
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.usuario.email || '', 
        contrasena: '',
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        fecha_nacimiento: formatToInputDate(initialData.fecha_nacimiento),
        dni: initialData.dni, 
        telefono: initialData.telefono || '',
        ciudad: initialData.ciudad || '',
        direccion: initialData.direccion || '',
        especialidad: initialData.especialidad || 'Administrador',
      });
    } else {
        setFormData({
          email: '', contrasena: '', nombre: '', apellido: '', fecha_nacimiento: '', dni: '', telefono: '', ciudad: '', direccion: '', especialidad: 'Administrador'
        });
    }
    setErrorModal(null);
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorModal(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);
    
    // Validaciones básicas
    if (!formData.email || !formData.email.includes('@')) {
      setErrorModal('Por favor, ingresa un email válido.');
      return;
    }
    if (!formData.nombre || !formData.apellido || !formData.dni) {
      setErrorModal('Los campos Nombre, Apellido y DNI son obligatorios.');
      return;
    }

    let dataToSend: any = { ...formData };
    dataToSend.dni = Number(dataToSend.dni);
    dataToSend.email = formData.email.trim().toLowerCase();
    
    // Formato de fecha para enviar al backend
    if (formData.fecha_nacimiento) {
        dataToSend.fecha_nacimiento = `${formData.fecha_nacimiento}T00:00:00Z`;
    } else {
        delete dataToSend.fecha_nacimiento;
    }

    if (initialData) {
      // Eliminar campos de Usuario (email/contrasena) del payload
      delete dataToSend.contrasena;
      delete dataToSend.email; 
      
      onSave(dataToSend as UpdateEmpleadoDto);
    } else {
      // CREACIÓN (POST)
      if (!formData.contrasena) {
        setErrorModal('La contraseña es requerida para crear un nuevo empleado.');
        return;
      }
      onSave(dataToSend as CreateEmpleadoDto);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">
          {initialData ? 'Editar Empleado' : 'Agregar Empleado'}
        </h2>
        
        {errorModal && (
          <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 transition-all duration-300">
            <strong>Error:</strong> {errorModal}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {/* Fila 1: Nombre, Apellido, DNI */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-tailwind">Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">Apellido</label>
              <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} className="input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">DNI</label>
              <input type="number" name="dni" value={formData.dni} onChange={handleChange} className="input-tailwind" required />
            </div>
          </div>

          {/* Fila 2: Email y Contraseña */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="input-tailwind" 
                // El email no se puede editar si ya existe (solo lectura)
                readOnly={!!initialData} 
                required 
              />
              {!!initialData && <p className='text-xs text-indigo-500 mt-1'>El email no se puede modificar al editar.</p>}
            </div>
            {!initialData && (
              <div>
                <label className="label-tailwind">Contraseña</label>
                <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} className="input-tailwind" required />
              </div>
            )}
            {/* Mostrar placeholder de contraseña solo si estamos editando */}
            {!!initialData && (
                <div>
                   <label className="label-tailwind">Contraseña</label>
                   <p className='text-sm text-gray-500 py-2 mt-1 border border-dashed rounded-lg px-2 bg-gray-50'>No editable en esta vista.</p>
                </div>
            )}
          </div>
          
          {/* Fila 3: Especialidad */}
          <div>
            <label className="label-tailwind">Especialidad</label>
            <input type="text" name="especialidad" value={formData.especialidad} onChange={handleChange} className="input-tailwind" required />
          </div>

          {/* Fila 4: Teléfono, Fecha Nacimiento, Ciudad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-tailwind">Teléfono</label>
              <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} className="input-tailwind" />
            </div>
            <div>
              <label className="label-tailwind">Fecha Nacimiento</label>
              <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange} className="input-tailwind" />
            </div>
            <div>
              <label className="label-tailwind">Ciudad</label>
              <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} className="input-tailwind" />
            </div>
          </div>

          {/* Fila 5: Dirección */}
          <div>
            <label className="label-tailwind">Dirección</label>
            <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="input-tailwind" />
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


// COMPONENTE PRINCIPAL (EXPORTADO COMO APP) 
const App: React.FC = () => {
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Empleado | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State para manejar errores del modal a nivel de componente principal 
  const [mainErrorModal, setMainErrorModal] = useState<string | null>(null);
  const setErrorModalInMain = (message: string) => {
    setMainErrorModal(`❌ Error: ${message}`);
    setTimeout(() => setMainErrorModal(null), 5000);
  };
  
  // Carga de Datos (FETCH) 
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
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

  // Filtros 
  const empleadosFiltrados = useMemo(() => {
    return empleados.filter((e) =>
      (e.nombre.toLowerCase() + " " + e.apellido.toLowerCase()).includes(searchTerm.toLowerCase()) ||
      e.usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
      e.especialidad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.dni.toString().includes(searchTerm) ||
      e.id.toString().includes(searchTerm)
    );
  }, [empleados, searchTerm]);

  // Handlers de Modales 
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

  // Handlers de CRUD 
  const handleSave = async (data: CreateEmpleadoDto | UpdateEmpleadoDto) => {
    try {
      if (itemParaEditar) {
        await fetchApi(`/empleado/${itemParaEditar.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(data) 
        });
      } else {
        await fetchApi('/empleado', { 
          method: 'POST', 
          body: JSON.stringify(data) 
        });
      }
      handleCloseModal();
      cargarDatos(); 
    } catch (err) {
      const errorMessage = (err as Error).message;
      setErrorModalInMain(errorMessage);
    }
  };

  const handleDelete = async (id: number) => {
    if (prompt('Para confirmar la eliminación, escribe "ELIMINAR"') === 'ELIMINAR') {
      try {
        await fetchApi(`/empleado/${id}`, { method: 'DELETE' });
        cargarDatos();
      } catch (err) {
        setErrorModalInMain(`Error al eliminar: ${(err as Error).message}`);
      }
    } else {
        setErrorModalInMain('Eliminación cancelada.');
    }
  };

  // ESTILOS NECESARIOS 
  const customStyles = `
    .btn-primary {
      @apply bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-150 shadow-md;
    }
    .btn-secondary {
      @apply bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-150;
    }
    .input-tailwind {
      @apply w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500;
    }
    .label-tailwind {
      @apply block text-sm font-medium text-gray-700 mb-1;
    }
    .th-cell {
      @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50;
    }
    .td-cell {
      @apply px-6 py-4 whitespace-nowrap text-sm text-gray-500;
    }
    .td-cell-main {
      @apply px-6 py-4 font-medium text-gray-900 whitespace-nowrap;
    }
    .td-center {
      @apply px-6 py-10 text-center text-sm text-gray-500;
    }
  `;

  // RENDER 
  return (
    <>
    <style>{customStyles}</style>
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8F108D]">Gestión de Empleados</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por Nombre, Email, Especialidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 "
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          <button onClick={handleOpenModalNuevo} className="btn-primary bg-[#8F108D] flex items-center justify-center">
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Empleado
          </button>
        </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4"><strong>Error de Carga:</strong> {error}</div>}
        {mainErrorModal && <div className="text-red-700 bg-red-100 p-3 rounded-lg mb-4 shadow-md transition-all duration-300">{mainErrorModal}</div>}


        {/* Tabla de Empleados */}
        <div className="overflow-x-auto rounded-lg">
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
            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={6} className="td-center">Cargando empleados...</td></tr>
              ) : empleadosFiltrados.length === 0 ? (
                <tr><td colSpan={6} className="td-center">No se encontraron empleados.</td></tr>
              ) : (
                empleadosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="td-cell-main">{item.nombre} {item.apellido}</td>
                    <td className="td-cell">{item.usuario.email}</td> 
                    <td className="td-cell">{item.especialidad}</td>
                    <td className="td-cell">{item.telefono}</td>
                    <td className="td-cell">{item.dni}</td>
                    <td className="td-cell text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModalEditar(item)} 
                        className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-indigo-100 transition-colors" 
                        data-tooltip-id="tooltip-main" 
                        data-tooltip-content="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors" 
                        data-tooltip-id="tooltip-main" 
                        data-tooltip-content="Eliminar"
                      >
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
      <Tooltip id="tooltip-main" place="top" className="z-50 shadow-lg opacity-100" />
    </div>
    </>
  );
};
export default App;