import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// 1. Definimos el TIPO de dato
interface Usuario {
  id: string;
  nombre: string;
  email: string;
}

// DATOS DE EJEMPLO
const MOCK_USUARIOS: Usuario[] = [
  { id: '1', nombre: 'Pepito Gomez', email: 'pepito@gmail.com' },
  { id: '2', nombre: 'Ana Martinez', email: 'ana.martinez@web.com' },
  { id: '3', nombre: 'Carlos Sanchez', email: 'carlos.s@demo.es' },
];

const SectionUsuarios: React.FC = () => {
  // --- ESTADOS ---
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<Usuario | null>(null);

  // --- EFECTOS ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setUsuarios(MOCK_USUARIOS);
      setLoading(false);
    }, 500);
  }, []);

  // --- FILTROS ---
  const usuariosFiltrados = useMemo(() => {
    if (!searchTerm) {
      return usuarios;
    }
    return usuarios.filter(
      (user) =>
        user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [usuarios, searchTerm]);

  // --- MANEJADORES DE ACCIONES (CRUD) ---
  const handleOpenModalNuevo = () => {
    setUsuarioParaEditar(null); 
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (usuario: Usuario) => {
    setUsuarioParaEditar(usuario);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUsuarioParaEditar(null);
  };
  const handleSaveUsuario = (usuarioData: Omit<Usuario, 'id'>) => {
    if (usuarioParaEditar) {
      // --- Lógica de ACTUALIZAR (EDITAR) ---
      setUsuarios(
        usuarios.map((u) =>
          u.id === usuarioParaEditar.id ? { ...u, ...usuarioData } : u
        )
      );
    } else {
      // --- Lógica de CREAR (NUEVO) ---
      const nuevoUsuario: Usuario = {
        id: (Math.random() * 1000).toString(), // Genera ID temporal
        ...usuarioData,
      };
      setUsuarios([nuevoUsuario, ...usuarios]);
    }
    handleCloseModal();
  };
  const handleDeleteUsuario = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      setUsuarios(usuarios.filter((u) => u.id !== id));
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Gestión de Usuarios
      </h1>

      {/* Tarjeta principal de contenido */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        
        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar Usuarios (Nombre o Email)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
          
          <button
            onClick={handleOpenModalNuevo}
            className="flex items-center justify-center bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition-colors duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Nuevo Usuario
          </button>
        </div>

        {/* Tabla de Usuarios */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">Email</th>
                <th className="th-cell">ID</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={4} className="td-center">Cargando usuarios...</td>
                </tr>
              ) : usuariosFiltrados.length === 0 ? (
                 <tr>
                  <td colSpan={4} className="td-center">
                    No se encontraron usuarios {searchTerm && `con el término "${searchTerm}"`}.
                  </td>
                </tr>
              ) : (
                usuariosFiltrados.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="td-cell font-medium text-gray-900 dark:text-white">{user.nombre}</td>
                    <td className="td-cell">{user.email}</td>
                    <td className="td-cell">{user.id}</td>
                    <td className="td-cell text-right space-x-2">
                      <button
                        onClick={() => handleOpenModalEditar(user)}
                        className="text-blue-600 hover:text-blue-800"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Editar Usuario"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUsuario(user.id)}
                        className="text-red-600 hover:text-red-800"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Eliminar Usuario"
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

      {/* Renderiza el Modal */}
      {isModalOpen && (
        <UsuarioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveUsuario}
          initialData={usuarioParaEditar}
        />
      )}

      {/* Componente Tooltip (requerido) */}
      <Tooltip id="tooltip-main" />
    </div>
  );
};

export default SectionUsuarios;


// --- COMPONENTE MODAL (UsuarioModal) ---

interface UsuarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Usuario, 'id'>) => void;
  initialData: Usuario | null; 
}

const UsuarioModal: React.FC<UsuarioModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [email, setEmail] = useState(initialData?.email || '');

  useEffect(() => {
    if (initialData) {
      setNombre(initialData.nombre || '');
      setEmail(initialData.email || '');
    } else {
      setNombre('');
      setEmail('');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !email) {
      alert('Nombre y Email son requeridos');
      return;
    }
    onSave({ nombre, email });
  };

  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Contenido del Modal */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">
            {initialData ? 'Editar Usuario' : 'Agregar Usuario'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white">&times;</button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="nombre" className="label-tailwind">Nombre</label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 w-full input-tailwind"
            />
          </div>
          <div>
            <label htmlFor="email" className="label-tailwind">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full input-tailwind"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
