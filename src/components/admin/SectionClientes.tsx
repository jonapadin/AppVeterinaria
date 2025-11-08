/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
// SectionClientes.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
// Importa tu helper de API
import { fetchApi } from '../../app/api'; 

// 1. Interfaz CLIENTE (basada en tu JSON)
interface Cliente {
  id: number; // Asumimos que la API devuelve un ID
  email: string;
  // No traemos la contraseña
  foto_perfil: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string; // Usar string, la API lo devuelve en formato ISO
  dni: number;
  telefono: string;
  ciudad: string;
  direccion: string;
}

// 2. Tipo para la CREACIÓN (DTO - Data Transfer Object)
// Incluye la contraseña solo al crear
type CreateClienteDto = Omit<Cliente, 'id'> & { contrasena: string };

const SectionClientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Cliente | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Datos (FETCH) ---
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // CORREGIDO: Usa el endpoint '/cliente' (singular)
      const data = await fetchApi('/cliente'); 
      setClientes(data);
    } catch (err) {
      // El error "No token provided" será capturado aquí
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []); // Se ejecuta solo una vez al montar el componente

  // --- Filtros ---
  const clientesFiltrados = useMemo(() => {
    return clientes.filter((c) =>
        (c.nombre.toLowerCase() + " " + c.apellido.toLowerCase()).includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.dni.toString().includes(searchTerm)
    );
  }, [clientes, searchTerm]);

  // --- Handlers de Modales ---
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

  // --- Handlers de CRUD ---
  const handleSave = async (data: CreateClienteDto | Omit<Cliente, 'id'>) => {
    try {
      if (itemParaEditar) {
        // Lógica de ACTUALIZAR (PUT)
        // CORREGIDO: endpoint singular
        await fetchApi(`/cliente/${itemParaEditar.id}`, { 
          method: 'PUT', 
          body: JSON.stringify(data) 
        });
      } else {
        // Lógica de CREAR (POST)
        // CORREGIDO: endpoint singular
        await fetchApi('/cliente', { 
          method: 'POST', 
          body: JSON.stringify(data) 
        });
      }
      handleCloseModal();
      cargarDatos(); // Recarga los datos después de guardar
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      try {
        // CORREGIDO: endpoint singular
        await fetchApi(`/cliente/${id}`, { method: 'DELETE' });
        cargarDatos(); // Recarga los datos después de eliminar
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Clientes</h1>

      {/* Tarjeta principal con fondo blanco */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        
        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por Nombre, Email, DNI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              // Estilo de input (asume 'input-tailwind' y 'focus:ring-primary' de tu CSS)
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <button 
            onClick={handleOpenModalNuevo} 
            // Estilo de botón primario (asume 'btn-primary' de tu CSS)
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

        {/* Tabla de Clientes */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Cabecera (asume 'th-cell' de tu CSS) */}
            <thead>
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">Email</th>
                <th className="th-cell">DNI</th>
                <th className="th-cell">Teléfono</th>
                <th className="th-cell">Ciudad</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            {/* Cuerpo (asume 'td-cell' de tu CSS) */}
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="td-center">Cargando clientes...</td>
                </tr>
              ) : clientesFiltrados.length === 0 ? (
                 <tr>
                  <td colSpan={6} className="td-center">
                    No se encontraron clientes {searchTerm && `con el término "${searchTerm}"`}.
                  </td>
                </tr>
              ) : (
                clientesFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{item.nombre} {item.apellido}</td>
                    <td className="td-cell">{item.email}</td>
                    <td className="td-cell">{item.dni}</td>
                    <td className="td-cell">{item.telefono}</td>
                    <td className="td-cell">{item.ciudad}</td>
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

      {/* Renderiza el Modal (si está abierto) */}
      {isModalOpen && (
        <ClienteModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={itemParaEditar}
        />
      )}

      {/* Componente Tooltip (requerido para los botones) */}
      <Tooltip id="tooltip-main" />
    </div>
  );
};

export default SectionClientes;

// --- COMPONENTE MODAL (ClienteModal) ---
// (Puede ir en un archivo separado, pero lo pongo aquí por simplicidad)

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  // Acepta ambos tipos (Crear o Editar)
  onSave: (data: CreateClienteDto | Omit<Cliente, 'id'>) => void;
  initialData: Cliente | null; 
}

/**
 * Convierte un string ISO "2024-01-23T10:00:00" a "2024-01-23"
 * para usarlo en un input de tipo 'date'.
 */
const formatToInputDate = (isoString: string | undefined) => {
  if (!isoString) return '';
  return isoString.split('T')[0];
};

const ClienteModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  // Estado para todos los campos del formulario
  const [formData, setFormData] = useState({
    email: initialData?.email || '',
    contrasena: '', // Siempre vacía al inicio (solo para crear)
    foto_perfil: initialData?.foto_perfil || '',
    nombre: initialData?.nombre || '',
    apellido: initialData?.apellido || '',
    fecha_nacimiento: formatToInputDate(initialData?.fecha_nacimiento),
    dni: initialData?.dni || '',
    telefono: initialData?.telefono || '',
    ciudad: initialData?.ciudad || '',
    direccion: initialData?.direccion || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepara los datos para enviar
    let dataToSend: any = { ...formData };
    
    // Convierte DNI a número
    dataToSend.dni = Number(dataToSend.dni);
    
    // Asegura que la fecha tenga el formato ISO con hora (T00:00:00Z)
    dataToSend.fecha_nacimiento = `${formData.fecha_nacimiento}T00:00:00Z`;

    if (initialData) {
      // Si estamos EDITANDO, no enviamos la contraseña
      delete dataToSend.contrasena;
      onSave(dataToSend as Omit<Cliente, 'id'>);
    } else {
      // Si estamos CREANDO, la contraseña es obligatoria
      if (!formData.contrasena) {
        alert('La contraseña es requerida para crear un nuevo cliente.');
        return;
      }
      onSave(dataToSend as CreateClienteDto);
    }
  };

  if (!isOpen) return null;

  return (
    // Overlay oscuro
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Contenido del Modal (fondo blanco) */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Cliente' : 'Agregar Cliente'}
        </h2>
        
        {/* Formulario con scroll si se pasa de alto */}
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
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
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