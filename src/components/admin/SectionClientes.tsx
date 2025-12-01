import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api'; 

interface Usuario {
  id: number;
  email: string;
  contrasena?: string;
  rol: string;
  fechaRegistro: string;
  estado: string;
}
// 1. Interfaz Cliente
interface Cliente {
  id: number; 
  foto_perfil: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; 
  dni: number;
  telefono: string;
  ciudad: string;
  direccion: string;
  usuario: Usuario;
}

// 2. DTO para CREACIÓN
type CreateClienteDto = Omit<Cliente, 'id' | 'usuario'> & { 
    email: string;
    contrasena: string;
};

// 3. DTO para EDICIÓN
type UpdateClienteDto = Omit<Cliente, 'id' | 'usuario'>;

const SectionClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);

  // FETCH
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/cliente'); 
      setClientes(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []); 

  //  Filtros 
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) =>
        (c.nombre.toLowerCase() + " " + c.apellido.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        c.usuario.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dni.toString().includes(searchTerm) ||
        c.id.toString().includes(searchTerm)
    );
  }, [clientes, searchTerm]);

  //  Handlers de Modales 
  const handleOpenModalNuevo = () => {
    setItemParaEditar(null); 
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (item: Cliente) => {
    setItemParaEditar(item);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemParaEditar(null);
  };

  //  Handlers de CRUD 
  const handleSave = async (data: CreateClienteDto | UpdateClienteDto) => {
    try {
      console.log('📧 Datos a enviar:', data);
      
      if (itemParaEditar) {
        console.log(`✏️ Editando cliente ${itemParaEditar.id}...`);
        // PUT
        await fetchApi(`/cliente/${itemParaEditar.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(data) 
        });
      } else {
        console.log('➕ Creando nuevo cliente...');
        // POST
        await fetchApi('/cliente', { 
          method: 'POST', 
          body: JSON.stringify(data) 
        });
      }
      handleCloseModal();
      cargarDatos(); 
    } catch (err) {
      const errorMessage = (err as Error).message;
      console.error('🚨 Error:', errorMessage);
      
      if (errorMessage.toLowerCase().includes('email') || errorMessage.toLowerCase().includes('unique')) {
        alert(`❌ Error: El email o DNI ya están registrados.`);
      } else {
        alert(`❌ Error al guardar: ${errorMessage}`);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        await fetchApi(`/cliente/${id}`, { method: 'DELETE' });
        cargarDatos(); 
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  //  RENDER 
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8F108D]">Gestión de Clientes</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        
        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por Nombre, Email, DNI o ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <button 
            onClick={handleOpenModalNuevo} 
            className="btn-primary flex items-center justify-center"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Cliente
          </button>
        </div>

        {/* Notificación de Error */}
        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">Email</th>
                <th className="th-cell">DNI</th>
                <th className="th-cell">Teléfono</th>
                <th className="th-cell">Ciudad</th>
                <th className="th-cell">ID</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="td-center">Cargando clientes...</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                 <tr>
                  <td colSpan={7} className="td-center">
                    No se encontraron clientes {searchTerm && `con el término "${searchTerm}"`}.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{item.nombre} {item.apellido}</td>
                    <td className="td-cell">{item.usuario.email}</td>
                    <td className="td-cell">{item.dni}</td>
                    <td className="td-cell">{item.telefono}</td>
                    <td className="td-cell">{item.ciudad}</td>
                    <td className="td-cell">{item.id}</td>
                    <td className="td-cell text-right space-x-2">
                      <button 
                        onClick={() => handleOpenModalEditar(item)} 
                        className="text-primary hover:text-primary-700" 
                        data-tooltip-id="tooltip-main" 
                        data-tooltip-content="Editar"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="text-red-600 hover:text-red-800" 
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
        <ClienteModal
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

export default SectionClientes;

//  COMPONENTE MODAL (ClienteModal) 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateClienteDto | UpdateClienteDto) => void;
  initialData: Cliente | null; 
}

const formatToInputDate = (isoString: string | undefined) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

const ClienteModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  const [formData, setFormData] = useState({
    //Leer el email del objeto 'usuario'
    email: initialData?.usuario.email || '', 
    contrasena: '', 
    foto_perfil: initialData?.foto_perfil || '',
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    fecha_nacimiento: formatToInputDate(initialData?.fecha_nacimiento),
    dni: initialData?.dni || '',
    telefono: initialData?.telefono || '',
    ciudad: initialData?.ciudad || '',
    direccion: initialData?.direccion || '',
  });

  const [errorModal, setErrorModal] = useState<string | null>(null);

  // Actualizar el formulario cuando cambien los datos iniciales
  useEffect(() => {
    if (initialData) {
      setFormData({
        email: initialData.usuario.email || '', 
        contrasena: '', 
        foto_perfil: initialData.foto_perfil || '',
        nombre: initialData.nombre || '',
        apellido: initialData.apellido || '',
        fecha_nacimiento: formatToInputDate(initialData.fecha_nacimiento),
        dni: initialData.dni || '',
        telefono: initialData.telefono || '',
        ciudad: initialData.ciudad || '',
        direccion: initialData.direccion || '',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrorModal(null); // Limpiar error al escribir
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorModal(null);
    
    if (!formData.email || !formData.email.includes('@')) {
      setErrorModal('Por favor, ingresa un email válido.');
      return;
    }
    
    let dataToSend: any = { ...formData };
    dataToSend.dni = Number(dataToSend.dni);
    dataToSend.email = formData.email.trim().toLowerCase();
    dataToSend.fecha_nacimiento = `${formData.fecha_nacimiento}T00:00:00Z`;

    if (initialData) {
      // (PUT): Solo se envían campos de Cliente, no de usuario
      delete dataToSend.contrasena;
      delete dataToSend.email; // 
      
      try {
        onSave(dataToSend as UpdateClienteDto); 
      } catch (err) {
        setErrorModal((err as Error).message);
      }
    } else {
      // (POST): Se envía todo para crear el Cliente y el Usuario
      if (!formData.contrasena) {
        setErrorModal('La contraseña es requerida para crear un nuevo cliente.');
        return;
      }
      try {
        onSave(dataToSend as CreateClienteDto);
      } catch (err) {
        setErrorModal((err as Error).message);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Cliente' : 'Agregar Cliente'}
        </h2>
        
        {errorModal && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            <strong>Error:</strong> {errorModal}
          </div>
        )}
        
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

          {/* Fila 2: Email y Contraseña (solo al crear) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                className="mt-1 w-full input-tailwind" 
                // El email no se puede editar si ya existe el cliente
                readOnly={!!initialData} 
                required 
              />
              {!!initialData && <p className='text-xs text-gray-500 mt-1'>El email no se puede modificar desde esta vista.</p>}
            </div>
            {!initialData && (
              <div>
                <label className="label-tailwind">Contraseña</label>
                <input type="password" name="contrasena" value={formData.contrasena} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
              </div>
            )}
          </div>

          {/* Fila 3: Teléfono, Fecha Nacimiento, Ciudad */}
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

          {/* Fila 4: Dirección y Foto Perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
              <label className="label-tailwind">Dirección</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
            <div>
              <label className="label-tailwind">URL Foto Perfil</label>
              <input type="text" name="foto_perfil" value={formData.foto_perfil} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
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