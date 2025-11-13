/* eslint-disable @typescript-eslint/ban-ts-comment */
// SectionTurnos.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api';

// 1. Interfaz TURNO (Modelo Asumido)
interface Turno {
  id: number;
  id_cliente: number;
  id_mascota: number;
  id_empleado: number; 
  fechaHora: string; 
  tipo: string; 
  estado: string; 
}
type CreateTurnoDto = Omit<Turno, 'id'>;

// Opciones
const OPCIONES_TIPO_TURNO = ['Consulta', 'Vacunación', 'Peluquería', 'Urgencia'];
const OPCIONES_ESTADO_TURNO = ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'];

// Helper para formato de fecha
const dateToLocalISOString = (date: Date): string => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
  return localISOTime;
};
const formatFechaDisplay = (isoString: string) => {
  if (!isoString) return 'Fecha inválida';
  return new Date(isoString).toLocaleString('es-ES', { 
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};

const SectionTurnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Turno | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/turno'); 
      setTurnos(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const turnosFiltrados = useMemo(() => {
    return turnos.filter(t => {
      const searchMatch = t.id_cliente.toString().includes(searchTerm) ||
                          t.id_mascota.toString().includes(searchTerm) ||
                          t.id_empleado.toString().includes(searchTerm);
      const tipoMatch = !filtroTipo || t.tipo === filtroTipo;
      const estadoMatch = !filtroEstado || t.estado === filtroEstado;
      return searchMatch && tipoMatch && estadoMatch;
    }).sort((a, b) => new Date(b.fechaHora).getTime() - new Date(a.fechaHora).getTime());
  }, [turnos, searchTerm, filtroTipo, filtroEstado]);

  // --- Handlers de Modales (CORREGIDOS) ---
  const handleOpenModalNuevo = () => { 
    setItemParaEditar(null); 
    setIsModalOpen(true); 
  };
  const handleOpenModalEditar = (item: Turno) => { 
    setItemParaEditar(item); 
    setIsModalOpen(true); 
  };
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
    setItemParaEditar(null); 
  };

  // --- Handlers de CRUD ---
  const handleSave = async (data: CreateTurnoDto) => {
    const dataToSend = {
      ...data,
      id_cliente: Number(data.id_cliente),
      id_mascota: Number(data.id_mascota),
      id_empleado: Number(data.id_empleado),
      fechaHora: new Date(data.fechaHora).toISOString(), 
    };
    try {
      if (itemParaEditar) {
        await fetchApi(`/turno/${itemParaEditar.id}`, { method: 'PUT', body: JSON.stringify(dataToSend) });
      } else {
        await fetchApi('/turno', { method: 'POST', body: JSON.stringify(dataToSend) });
      }
      handleCloseModal();
      cargarDatos();
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar este turno?')) {
      try {
        await fetchApi(`/turno/${id}`, { method: 'DELETE' });
        cargarDatos();
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Turnos</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input type="text" placeholder="Buscar por ID Cliente, Mascota o Empleado..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button onClick={handleOpenModalNuevo} className="btn-primary flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Turno
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label-tailwind mb-1">Tipo de Turno</label>
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className="input-tailwind w-full">
                <option value="">Todos los Tipos</option>
                {OPCIONES_TIPO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado del Turno</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="input-tailwind w-full">
                <option value="">Todos los Estados</option>
                {OPCIONES_ESTADO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4"><strong>Error:</strong> {error}</div>}

        {/* Tabla de Turnos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">Fecha y Hora</th>
                <th className="th-cell">ID Cliente</th>
                <th className="th-cell">ID Mascota</th>
                <th className="th-cell">ID Empleado</th>
                <th className="th-cell">Tipo</th>
                <th className="th-cell">Estado</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7} className="td-center">Cargando turnos...</td></tr>
              ) : turnosFiltrados.length === 0 ? (
                 <tr><td colSpan={7} className="td-center">No se encontraron turnos.</td></tr>
              ) : (
                turnosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{formatFechaDisplay(item.fechaHora)}</td>
                    <td className="td-cell">{item.id_cliente}</td>
                    <td className="td-cell">{item.id_mascota}</td>
                    <td className="td-cell">{item.id_empleado}</td>
                    <td className="td-cell">{item.tipo}</td>
                    <td className="td-cell">{item.estado}</td>
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
        <TurnoModal
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
export default SectionTurnos;

// --- MODAL (TurnoModal) ---
interface TurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTurnoDto) => void;
  initialData: Turno | null;
}

const TurnoModal: React.FC<TurnoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  const [formData, setFormData] = useState({
    fechaHora: initialData ? dateToLocalISOString(new Date(initialData.fechaHora)) : dateToLocalISOString(new Date()),
    id_cliente: initialData?.id_cliente || '',
    id_mascota: initialData?.id_mascota || '',
    id_empleado: initialData?.id_empleado || '',
    tipo: initialData?.tipo || 'Consulta',
    estado: initialData?.estado || 'Pendiente',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Turno' : 'Agregar Turno'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-tailwind">Fecha y Hora</label>
            <input type="datetime-local" name="fechaHora" value={formData.fechaHora}
              onChange={handleChange} className="mt-1 w-full input-tailwind" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div>
              <label className="label-tailwind">ID Cliente</label>
              <input type="number" name="id_cliente" value={formData.id_cliente} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
             <div>
              <label className="label-tailwind">ID Mascota</label>
              <input type="number" name="id_mascota" value={formData.id_mascota} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
             <div>
              <label className="label-tailwind">ID Empleado</label>
              <input type="number" name="id_empleado" value={formData.id_empleado} onChange={handleChange} className="mt-1 w-full input-tailwind" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Tipo de Turno</label>
              <select name="tipo" value={formData.tipo} onChange={handleChange} className="mt-1 w-full input-tailwind">
                {OPCIONES_TIPO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
             <div>
              <label className="label-tailwind">Estado del Turno</label>
              <select name="estado" value={formData.estado} onChange={handleChange} className="mt-1 w-full input-tailwind">
                {OPCIONES_ESTADO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  );
};