// SectionTurnos.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// 1. Definimos el TIPO de dato
type TipoTurno = 'Consulta' | 'Vacunación' | 'Peluquería' | 'Urgencia';
type EstadoTurno = 'Pendiente' | 'Confirmado' | 'Completado' | 'Cancelado';

interface Turno {
  id: string;
  fechaHora: Date;
  mascotaNombre: string; 
  dueñoEmail: string;
  tipo: TipoTurno;
  estado: EstadoTurno;
}

// DATOS DE EJEMPLO
const MOCK_TURNOS: Turno[] = [
  { id: 't1', fechaHora: new Date('2025-11-06T10:00:00'), mascotaNombre: 'Fido', dueñoEmail: 'pepito@gmail.com', tipo: 'Consulta', estado: 'Confirmado' },
  { id: 't2', fechaHora: new Date('2025-11-06T11:00:00'), mascotaNombre: 'Milo', dueñoEmail: 'refugio@mail.com', tipo: 'Vacunación', estado: 'Pendiente' },
  { id: 't3', fechaHora: new Date('2025-11-05T14:00:00'), mascotaNombre: 'Rocky', dueñoEmail: 'refugio@mail.com', tipo: 'Peluquería', estado: 'Completado' },
];

// Opciones para los filtros
const OPCIONES_TIPO_TURNO: TipoTurno[] = ['Consulta', 'Vacunación', 'Peluquería', 'Urgencia'];
const OPCIONES_ESTADO_TURNO: EstadoTurno[] = ['Pendiente', 'Confirmado', 'Completado', 'Cancelado'];


const SectionTurnos: React.FC = () => {
  // --- ESTADOS ---
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<TipoTurno | ''>('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoTurno | ''>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [turnoParaEditar, setTurnoParaEditar] = useState<Turno | null>(null);

  // --- EFECTOS ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setTurnos(MOCK_TURNOS);
      setLoading(false);
    }, 1000);
  }, []);

  // --- FILTROS (useMemo) ---
  const turnosFiltrados = useMemo(() => {
    let filtrados = turnos;

    if (searchTerm) {
      filtrados = filtrados.filter(t =>
        t.mascotaNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.dueñoEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filtroTipo) {
      filtrados = filtrados.filter(t => t.tipo === filtroTipo);
    }
    if (filtroEstado) {
      filtrados = filtrados.filter(t => t.estado === filtroEstado);
    }

    return filtrados.sort((a, b) => b.fechaHora.getTime() - a.fechaHora.getTime());
  }, [turnos, searchTerm, filtroTipo, filtroEstado]);

  // --- MANEJADORES DE ACCIONES (CRUD) ---
  const handleOpenModalNuevo = () => {
    setTurnoParaEditar(null);
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (turno: Turno) => {
    setTurnoParaEditar(turno);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTurnoParaEditar(null);
  };
  const handleSaveTurno = (data: Omit<Turno, 'id'>) => {
    if (turnoParaEditar) {
      setTurnos(
        turnos.map((t) =>
          t.id === turnoParaEditar.id ? { ...t, ...data } : t
        )
      );
    } else {
      const nuevoTurno: Turno = {
        id: (Math.random() * 1000).toString(),
        ...data,
      };
      setTurnos([nuevoTurno, ...turnos]);
    }
    handleCloseModal();
  };
  const handleDeleteTurno = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar este turno?')) {
      setTurnos(turnos.filter((t) => t.id !== id));
    }
  };

  // Helper para formatear la fecha
  const formatFecha = (date: Date) => {
    return date.toLocaleString('es-ES', { 
      day: '2-digit', month: '2-digit', year: 'numeric', 
      hour: '2-digit', minute: '2-digit' 
    });
  }

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Gestión de Turnos
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input type="text" placeholder="Buscar por Mascota o Dueño..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value as TipoTurno | '')} className="input-tailwind w-full">
                <option value="">Todos los Tipos</option>
                {OPCIONES_TIPO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado del Turno</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoTurno | '')} className="input-tailwind w-full">
                <option value="">Todos los Estados</option>
                {OPCIONES_ESTADO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Turnos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="th-cell">Fecha y Hora</th>
                <th className="th-cell">Mascota</th>
                <th className="th-cell">Dueño (Email)</th>
                <th className="th-cell">Tipo</th>
                <th className="th-cell">Estado</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={6} className="td-center">Cargando turnos...</td></tr>
              ) : turnosFiltrados.length === 0 ? (
                 <tr><td colSpan={6} className="td-center">No se encontraron turnos con esos filtros.</td></tr>
              ) : (
                turnosFiltrados.map((turno) => (
                  <tr key={turno.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="td-cell font-medium">{formatFecha(turno.fechaHora)}</td>
                    <td className="td-cell">{turno.mascotaNombre}</td>
                    <td className="td-cell">{turno.dueñoEmail}</td>
                    <td className="td-cell">{turno.tipo}</td>
                    <td className="td-cell">{turno.estado}</td>
                    <td className="td-cell text-right space-x-2">
                      <button onClick={() => handleOpenModalEditar(turno)} className="text-blue-600 hover:text-blue-800" data-tooltip-id="tooltip-main" data-tooltip-content="Editar Turno">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteTurno(turno.id)} className="text-red-600 hover:text-red-800" data-tooltip-id="tooltip-main" data-tooltip-content="Eliminar Turno">
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
          onSave={handleSaveTurno}
          initialData={turnoParaEditar}
        />
      )}
      <Tooltip id="tooltip-main" />
    </div>
  );
};

export default SectionTurnos;


// --- COMPONENTE MODAL (TurnoModal) ---

interface TurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Turno, 'id'>) => void;
  initialData: Turno | null;
}

// Helper para convertir Date a string 'yyyy-MM-ddThh:mm'
const dateToLocalISOString = (date: Date): string => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
  return localISOTime;
};

const TurnoModal: React.FC<TurnoModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  const [fechaHoraStr, setFechaHoraStr] = useState(
    initialData ? dateToLocalISOString(initialData.fechaHora) : dateToLocalISOString(new Date())
  );
  const [mascotaNombre, setMascotaNombre] = useState(initialData?.mascotaNombre || '');
  const [dueñoEmail, setDueñoEmail] = useState(initialData?.dueñoEmail || '');
  const [tipo, setTipo] = useState<TipoTurno>(initialData?.tipo || 'Consulta');
  const [estado, setEstado] = useState<EstadoTurno>(initialData?.estado || 'Pendiente');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaHoraStr || !mascotaNombre || !dueñoEmail) {
      alert('Todos los campos son requeridos');
      return;
    }
    onSave({ 
      fechaHora: new Date(fechaHoraStr), 
      mascotaNombre, 
      dueñoEmail, 
      tipo, 
      estado 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {initialData ? 'Editar Turno' : 'Agregar Turno'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label-tailwind">Fecha y Hora</label>
            <input 
              type="datetime-local" 
              value={fechaHoraStr}
              onChange={(e) => setFechaHoraStr(e.target.value)}
              className="mt-1 w-full input-tailwind" />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="label-tailwind">Nombre Mascota</label>
              <input type="text" value={mascotaNombre} onChange={(e) => setMascotaNombre(e.target.value)}
                className="mt-1 w-full input-tailwind" />
            </div>
             <div>
              <label className="label-tailwind">Email Dueño</label>
              <input type="email" value={dueñoEmail} onChange={(e) => setDueñoEmail(e.target.value)}
                className="mt-1 w-full input-tailwind" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Tipo de Turno</label>
              <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoTurno)}
                className="mt-1 w-full input-tailwind">
                {OPCIONES_TIPO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
             <div>
              <label className="label-tailwind">Estado del Turno</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoTurno)}
                className="mt-1 w-full input-tailwind">
                {OPCIONES_ESTADO_TURNO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
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