/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// SectionTurnos.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api';

// --- INTERFACES Y CONSTANTES ---
const OPCIONES_TIPO_TURNO = ['consulta', 'vacunacion', 'peluqueria', 'urgencia'];
const OPCIONES_ESTADO_TURNO = ['pendiente', 'completado', 'cancelado'];

interface MascotaSimple {
    id: number;
    nombre: string;
}

interface Turno {
  id_turno: number;
  fecha_turno: string; 
  tipo: typeof OPCIONES_TIPO_TURNO[number]; 
  estado: typeof OPCIONES_ESTADO_TURNO[number];
  observaciones: string;
  // La Mascota PUEDE ser null si la relación no se carga (DB/API)
  mascota: { id: number, nombre: string, cliente?: { id: number } } | null; 
}

// DTO para enviar a la API: usa la clave foránea simple (mascota_id)
type CreateTurnoDto = Omit<Turno, 'id_turno' | 'mascota'> & { mascota_id: number | string };

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
  
  // Estado para la lista de mascotas
  const [mascotas, setMascotas] = useState<MascotaSimple[]>([]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Carga de turnos
      const turnosData = await fetchApi('/turno'); 
      setTurnos(turnosData);
      
      // 2. Carga de mascotas para el selector
      const mascotasData = await fetchApi('/mascotas'); // Endpoint de mascotas
      // Mapeamos a MascotaSimple para el selector
      setMascotas(mascotasData.map((m: any) => ({ id: m.id, nombre: m.nombre })));

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
      // Usamos encadenamiento opcional para evitar errores si 'mascota' es null
      const mascotaNombre = t.mascota?.nombre?.toLowerCase() ?? '';
      const clienteId = t.mascota?.cliente?.id?.toString() ?? '';
      
      const searchMatch = mascotaNombre.includes(searchTerm.toLowerCase()) ||
                          t.mascota?.id?.toString().includes(searchTerm) ||
                          clienteId.includes(searchTerm);
      
      const tipoMatch = !filtroTipo || t.tipo === filtroTipo;
      const estadoMatch = !filtroEstado || t.estado === filtroEstado;
      
      return searchMatch && tipoMatch && estadoMatch;
    }).sort((a, b) => new Date(b.fecha_turno).getTime() - new Date(a.fecha_turno).getTime());
  }, [turnos, searchTerm, filtroTipo, filtroEstado]);

  // --- Handlers de Modales ---
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
    
    // Mapeo del DTO para enviar a la API
    const dataToSend = {
      fecha_turno: new Date(data.fecha_turno).toISOString(), 
      tipo: data.tipo, 
      estado: data.estado,
      observaciones: data.observaciones,
      // CORRECTO: Enviamos la clave foránea simple como número
      mascota_id: Number(data.mascota_id), 
    };
    
    try {
      if (itemParaEditar) {
        await fetchApi(`/turno/${itemParaEditar.id_turno}`, { method: 'PATCH', body: JSON.stringify(dataToSend) });
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
      <h1 className="text-3xl font-bold text-[#8F108D]">Gestión de Turnos</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filtros y Botón Nuevo */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative">
              <input type="text" placeholder="Buscar por Mascota o ID Mascota/Cliente..."
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
                {OPCIONES_TIPO_TURNO.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado del Turno</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="input-tailwind w-full">
                <option value="">Todos los Estados</option>
                {OPCIONES_ESTADO_TURNO.map(e => <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>)}
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
                <th className="th-cell">ID Turno</th>
                <th className="th-cell">Fecha y Hora</th>
                <th className="th-cell">Mascota (ID)</th>
                <th className="th-cell">Tipo</th>
                <th className="th-cell">Observaciones</th>
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
                  <tr key={item.id_turno} className="hover:bg-gray-50">
                    <td className="td-cell">{item.id_turno}</td>
                    <td className="td-cell-main">{formatFechaDisplay(item.fecha_turno)}</td>
                    
                    {/* Verificación de Nulidad para la mascota */}
                    <td className="td-cell">
                        {item.mascota
                            ? `${item.mascota.nombre} (${item.mascota.id})`
                            : 'Mascota no disponible'}
                    </td>
                    
                    <td className="td-cell">{item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</td>
                    <td className="td-cell truncate max-w-xs">{item.observaciones}</td>
                    <td className="td-cell">{item.estado.charAt(0).toUpperCase() + item.estado.slice(1)}</td>
                    <td className="td-cell text-right space-x-2">
                      <button onClick={() => handleOpenModalEditar(item)} className="text-primary hover:text-primary-700" data-tooltip-id="tooltip-main" data-tooltip-content="Editar">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDelete(item.id_turno)} className="text-red-600 hover:text-red-800" data-tooltip-id="tooltip-main" data-tooltip-content="Eliminar">
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
          // Pasamos la lista de mascotas al modal
          mascotas={mascotas} 
        />
      )}
      <Tooltip id="tooltip-main" />
    </div>
  );
};
export default SectionTurnos;

// ----------------------------------------------------------------------------------

// --- MODAL (TurnoModal) ---
interface TurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTurnoDto) => void;
  initialData: Turno | null;
  mascotas: MascotaSimple[]; // Nueva Prop para el selector
}

const TurnoModal: React.FC<TurnoModalProps> = ({ isOpen, onClose, onSave, initialData, mascotas }) => {
  
  const [formData, setFormData] = useState({
    // Usamos encadenamiento opcional para obtener el ID inicial, o cadena vacía si es null
    mascota_id: initialData?.mascota?.id.toString() || '', 
    fecha_turno: initialData ? dateToLocalISOString(new Date(initialData.fecha_turno)) : dateToLocalISOString(new Date()),
    tipo: initialData?.tipo || OPCIONES_TIPO_TURNO[0], 
    estado: initialData?.estado || OPCIONES_ESTADO_TURNO[0],
    observaciones: initialData?.observaciones || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as CreateTurnoDto);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Turno' : 'Agregar Turno'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-4">
            {/* ✅ CAMPO DE SELECCIÓN DE MASCOTA */}
            <div>
              <label className="label-tailwind">Mascota</label>
              <select 
                name="mascota_id" 
                value={formData.mascota_id} 
                onChange={handleChange} 
                className="mt-1 w-full input-tailwind"
                required
              >
                <option value="" disabled>Seleccione una mascota</option>
                {mascotas.map(m => (
                    <option key={m.id} value={m.id}>
                        {m.nombre} (ID: {m.id})
                    </option>
                ))}
              </select>
            </div>
            
            {/* Campo de Fecha */}
            <div>
              <label className="label-tailwind">Fecha y Hora</label>
              <input 
                type="datetime-local" 
                name="fecha_turno" 
                value={formData.fecha_turno}
                onChange={handleChange} 
                className="mt-1 w-full input-tailwind" 
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Campo de Tipo */}
            <div>
              <label className="label-tailwind">Tipo de Turno</label>
              <select 
                name="tipo" 
                value={formData.tipo} 
                onChange={handleChange} 
                className="mt-1 w-full input-tailwind" 
                required
              >
                {OPCIONES_TIPO_TURNO.map(e => (
                  <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                ))}
              </select>
            </div>
            {/* Campo de Estado */}
            <div>
              <label className="label-tailwind">Estado del Turno</label>
              <select 
                name="estado" 
                value={formData.estado} 
                onChange={handleChange} 
                className="mt-1 w-full input-tailwind" 
                required
              >
                {OPCIONES_ESTADO_TURNO.map(e => (
                  <option key={e} value={e}>{e.charAt(0).toUpperCase() + e.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Campo de Observaciones */}
          <div>
            <label className="label-tailwind">Observaciones</label>
            <textarea 
              name="observaciones" 
              value={formData.observaciones} 
              onChange={handleChange as any} 
              rows={3}
              className="mt-1 w-full input-tailwind"
              required
            />
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