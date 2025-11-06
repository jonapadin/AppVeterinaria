// SectionMascotas.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// 1. Definimos el TIPO de dato
type Especie = 'Perro' | 'Gato' | 'Otro';
type EstadoMascota = 'Con Dueño' | 'En Adopción' | 'En Refugio';

interface Mascota {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  estado: EstadoMascota;
  dueñoEmail: string; // Email del usuario dueño
}

// DATOS DE EJEMPLO
const MOCK_MASCOTAS: Mascota[] = [
  { id: 'm1', nombre: 'Fido', especie: 'Perro', raza: 'Labrador', estado: 'Con Dueño', dueñoEmail: 'pepito@gmail.com' },
  { id: 'm2', nombre: 'Milo', especie: 'Gato', raza: 'Siames', estado: 'En Adopción', dueñoEmail: 'refugio@mail.com' },
  { id: 'm3', nombre: 'Rocky', especie: 'Perro', raza: 'Mixto', estado: 'En Refugio', dueñoEmail: 'refugio@mail.com' },
];

// Opciones para los filtros
const OPCIONES_ESPECIE: Especie[] = ['Perro', 'Gato', 'Otro'];
const OPCIONES_ESTADO: EstadoMascota[] = ['Con Dueño', 'En Adopción', 'En Refugio'];


const SectionMascotas: React.FC = () => {
  // --- ESTADOS ---
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Estados de Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEspecie, setFiltroEspecie] = useState<Especie | ''>(''); 
  const [filtroEstado, setFiltroEstado] = useState<EstadoMascota | ''>(''); 

  // Estado del Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mascotaParaEditar, setMascotaParaEditar] = useState<Mascota | null>(null);

  // --- EFECTOS ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMascotas(MOCK_MASCOTAS);
      setLoading(false);
    }, 1000);
  }, []);

  // --- FILTROS (useMemo) ---
  const mascotasFiltradas = useMemo(() => {
    let filtradas = mascotas;

    if (searchTerm) {
      filtradas = filtradas.filter(m =>
        m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.raza.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.dueñoEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filtroEspecie) {
      filtradas = filtradas.filter(m => m.especie === filtroEspecie);
    }
    if (filtroEstado) {
      filtradas = filtradas.filter(m => m.estado === filtroEstado);
    }

    return filtradas;
  }, [mascotas, searchTerm, filtroEspecie, filtroEstado]);

  // --- MANEJADORES DE ACCIONES (CRUD) ---
  const handleOpenModalNuevo = () => {
    setMascotaParaEditar(null);
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (mascota: Mascota) => {
    setMascotaParaEditar(mascota);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setMascotaParaEditar(null);
  };
  const handleSaveMascota = (data: Omit<Mascota, 'id'>) => {
    if (mascotaParaEditar) {
      setMascotas(
        mascotas.map((m) =>
          m.id === mascotaParaEditar.id ? { ...m, ...data } : m
        )
      );
    } else {
      const nuevaMascota: Mascota = {
        id: (Math.random() * 1000).toString(),
        ...data,
      };
      setMascotas([nuevaMascota, ...mascotas]);
    }
    handleCloseModal();
  };
  const handleDeleteMascota = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta mascota?')) {
      setMascotas(mascotas.filter((m) => m.id !== id));
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Gestión de Mascotas
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        
        {/* Barra de Filtros y Acciones */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por Nombre, Raza, Dueño..."
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
              Nueva Mascota
            </button>
          </div>

          {/* Filtros Avanzados (Select) */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label-tailwind mb-1">Especie</label>
              <select
                value={filtroEspecie}
                onChange={(e) => setFiltroEspecie(e.target.value as Especie | '')}
                className="w-full input-tailwind"
              >
                <option value="">Todas las Especies</option>
                {OPCIONES_ESPECIE.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value as EstadoMascota | '')}
                className="w-full input-tailwind"
              >
                <option value="">Todos los Estados</option>
                {OPCIONES_ESTADO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Mascotas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">Especie</th>
                <th className="th-cell">Raza</th>
                <th className="th-cell">Estado</th>
                <th className="th-cell">Dueño (Email)</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={6} className="td-center">Cargando mascotas...</td></tr>
              ) : mascotasFiltradas.length === 0 ? (
                 <tr><td colSpan={6} className="td-center">No se encontraron mascotas con esos filtros.</td></tr>
              ) : (
                mascotasFiltradas.map((mascota) => (
                  <tr key={mascota.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="td-cell font-medium text-gray-900 dark:text-white">{mascota.nombre}</td>
                    <td className="td-cell">{mascota.especie}</td>
                    <td className="td-cell">{mascota.raza}</td>
                    <td className="td-cell">{mascota.estado}</td>
                    <td className="td-cell">{mascota.dueñoEmail}</td>
                    <td className="td-cell text-right space-x-2">
                      <button onClick={() => handleOpenModalEditar(mascota)} className="text-blue-600 hover:text-blue-800" data-tooltip-id="tooltip-main" data-tooltip-content="Editar Mascota">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteMascota(mascota.id)} className="text-red-600 hover:text-red-800" data-tooltip-id="tooltip-main" data-tooltip-content="Eliminar Mascota">
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
        <MascotaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveMascota}
          initialData={mascotaParaEditar}
        />
      )}

      {/* Componente Tooltip */}
      <Tooltip id="tooltip-main" />
    </div>
  );
};

export default SectionMascotas;

// --- COMPONENTE MODAL (MascotaModal) ---

interface MascotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Mascota, 'id'>) => void;
  initialData: Mascota | null;
}

const MascotaModal: React.FC<MascotaModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [nombre, setNombre] = useState(initialData?.nombre || '');
  const [especie, setEspecie] = useState<Especie>(initialData?.especie || 'Perro');
  const [raza, setRaza] = useState(initialData?.raza || '');
  const [estado, setEstado] = useState<EstadoMascota>(initialData?.estado || 'En Refugio');
  const [dueñoEmail, setDueñoEmail] = useState(initialData?.dueñoEmail || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre || !raza || !dueñoEmail) {
      alert('Todos los campos son requeridos');
      return;
    }
    onSave({ nombre, especie, raza, estado, dueñoEmail });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {initialData ? 'Editar Mascota' : 'Agregar Mascota'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Nombre</label>
              <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)}
                className="mt-1 w-full input-tailwind" />
            </div>
            <div>
              <label className="label-tailwind">Raza</label>
              <input type="text" value={raza} onChange={(e) => setRaza(e.target.value)}
                className="mt-1 w-full input-tailwind" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Especie</label>
              <select value={especie} onChange={(e) => setEspecie(e.target.value as Especie)}
                className="mt-1 w-full input-tailwind">
                {OPCIONES_ESPECIE.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
             <div>
              <label className="label-tailwind">Estado</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoMascota)}
                className="mt-1 w-full input-tailwind">
                {OPCIONES_ESTADO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label-tailwind">Email del Dueño/Refugio</label>
            <input type="email" value={dueñoEmail} onChange={(e) => setDueñoEmail(e.target.value)}
              className="mt-1 w-full input-tailwind" />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};