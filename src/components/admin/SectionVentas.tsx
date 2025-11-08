/* eslint-disable @typescript-eslint/ban-ts-comment */
// SectionVentas.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api';

// 1. Interfaz VENTA y DETALLE
interface DetalleVenta {
  id_producto: number;
  cantidad: number;
}
interface Venta {
  id: number;
  id_cliente: number;
  id_empleado: number;
  fecha: string;
  metodo_pago: string;
  estado_pago: string;
  detalles: DetalleVenta[];
}

// DTO para el ESTADO del modal (incluye precio)
interface DetalleModalState {
  id_producto: string;
  cantidad: string;
  precio_unitario: string; 
}
// DTO para crear/editar
type CreateVentaDto = Omit<Venta, 'id' | 'detalles'> & {
  detalles: DetalleVenta[] // El backend solo necesita ID y cantidad
}

// Opciones
const OPCIONES_METODO_PAGO = ['Efectivo', 'Tarjeta', 'Transferencia'];
const OPCIONES_ESTADO_PAGO = ['Pendiente', 'Pagada', 'Cancelada'];

const formatFechaDisplay = (isoString: string) => {
  if (!isoString) return 'Fecha inválida';
  return new Date(isoString).toLocaleDateString('es-ES', { 
    day: '2-digit', month: '2-digit', year: 'numeric' 
  });
};

const SectionVentas: React.FC = () => {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Venta | null>(null);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/ventas'); 
      setVentas(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const ventasFiltradas = useMemo(() => {
    return ventas.filter(v => {
      const searchMatch = v.id_cliente.toString().includes(searchTerm) ||
                          v.id_empleado.toString().includes(searchTerm);
      const metodoMatch = !filtroMetodoPago || v.metodo_pago === filtroMetodoPago;
      const estadoMatch = !filtroEstado || v.estado_pago === filtroEstado;
      return searchMatch && metodoMatch && estadoMatch;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ventas, searchTerm, filtroMetodoPago, filtroEstado]);

  // --- Handlers de Modales (CORREGIDOS) ---
  const handleOpenModalNuevo = () => { setItemParaEditar(null); setIsModalOpen(true); };
  const handleOpenModalEditar = (item: Venta) => { setItemParaEditar(item); setIsModalOpen(true); };
  const handleCloseModal = () => { setIsModalOpen(false); setItemParaEditar(null); };

  // --- Handlers de CRUD ---
  const handleSave = async (data: Omit<Venta, 'id'>) => {
    const dataToSend: CreateVentaDto = {
      ...data,
      id_cliente: Number(data.id_cliente),
      id_empleado: Number(data.id_empleado),
      fecha: new Date(data.fecha).toISOString(),
      detalles: data.detalles.map(d => ({ 
        id_producto: Number(d.id_producto),
        cantidad: Number(d.cantidad)
      }))
    };

    try {
      if (itemParaEditar) {
        await fetchApi(`/ventas/${itemParaEditar.id}`, { method: 'PUT', body: JSON.stringify(dataToSend) });
      } else {
        await fetchApi('/ventas', { method: 'POST', body: JSON.stringify(dataToSend) });
      }
      handleCloseModal();
      cargarDatos();
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      try {
        await fetchApi(`/ventas/${id}`, { method: 'DELETE' });
        cargarDatos();
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };
  
  const calcularTotalItems = (detalles: DetalleVenta[]) => {
    return detalles.reduce((acc, item) => acc + item.cantidad, 0);
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Ventas</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input type="text" placeholder="Buscar por ID Cliente o ID Empleado..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button onClick={handleOpenModalNuevo} className="btn-primary flex items-center justify-center">
              <Plus className="w-5 h-5 mr-2" />
              Nueva Venta
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label-tailwind mb-1">Método de Pago</label>
              <select value={filtroMetodoPago} onChange={(e) => setFiltroMetodoPago(e.target.value)} className="input-tailwind w-full">
                <option value="">Todos</option>
                {OPCIONES_METODO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado de Pago</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)} className="input-tailwind w-full">
                <option value="">Todos</option>
                {OPCIONES_ESTADO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {error && <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4"><strong>Error:</strong> {error}</div>}

        {/* Tabla de Ventas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">ID Venta</th>
                <th className="th-cell">Fecha</th>
                <th className="th-cell">ID Cliente</th>
                <th className="th-cell">ID Empleado</th>
                <th className="th-cell">Items (Cant.)</th>
                <th className="th-cell">Método Pago</th>
                <th className="th-cell">Estado Pago</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={8} className="td-center">Cargando ventas...</td></tr>
              ) : ventasFiltradas.length === 0 ? (
                 <tr><td colSpan={8} className="td-center">No se encontraron ventas.</td></tr>
              ) : (
                ventasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">#{item.id}</td>
                    <td className="td-cell">{formatFechaDisplay(item.fecha)}</td>
                    <td className="td-cell">{item.id_cliente}</td>
                    <td className="td-cell">{item.id_empleado}</td>
                    <td className="td-cell">{calcularTotalItems(item.detalles)}</td>
                    <td className="td-cell">{item.metodo_pago}</td>
                    <td className="td-cell">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                         item.estado_pago === 'Pagada' ? 'bg-green-100 text-green-800' 
                         : item.estado_pago === 'Cancelada' ? 'bg-red-100 text-red-800'
                         : 'bg-yellow-100 text-yellow-800'
                       }`}>
                        {item.estado_pago}
                       </span>
                    </td>
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
        <VentaModal
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
export default SectionVentas;

// --- MODAL (VentaModal) ---
interface VentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Venta, 'id'>) => void;
  initialData: Venta | null;
}

const VentaModal: React.FC<VentaModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  const [formData, setFormData] = useState({
    fecha: initialData ? initialData.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
    id_cliente: initialData?.id_cliente || '',
    id_empleado: initialData?.id_empleado || '',
    metodo_pago: initialData?.metodo_pago || 'Efectivo',
    estado_pago: initialData?.estado_pago || 'Pendiente',
  });
  
  const [detalles, setDetalles] = useState<DetalleModalState[]>(
    initialData?.detalles.map(d => ({ 
      id_producto: String(d.id_producto),
      cantidad: String(d.cantidad),
      precio_unitario: '0' 
    })) || [{ id_producto: '', cantidad: '1', precio_unitario: '0' }]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDetalleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const nuevosDetalles = [...detalles];
    // @ts-ignore
    nuevosDetalles[index][name] = value;
    setDetalles(nuevosDetalles);
  };

  const addDetalle = () => {
    setDetalles([...detalles, { id_producto: '', cantidad: '1', precio_unitario: '0' }]);
  };

  const removeDetalle = (index: number) => {
    if (detalles.length <= 1) return;
    const nuevosDetalles = detalles.filter((_, i) => i !== index);
    setDetalles(nuevosDetalles);
  };
  
  const calcularTotal = () => {
    return detalles.reduce((acc, d) => {
      const cant = Number(d.cantidad) || 0;
      const precio = Number(d.precio_unitario) || 0;
      return acc + (cant * precio);
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dataFinal = {
      ...formData,
      // @ts-ignore
      detalles: detalles.map(d => ({ 
        id_producto: Number(d.id_producto),
        cantidad: Number(d.cantidad)
      })),
    };
    // @ts-ignore
    onSave(dataFinal);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Venta' : 'Registrar Venta'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {/* Fila 1: Cliente, Empleado, Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-tailwind">ID Cliente</label>
              <input type="number" name="id_cliente" value={formData.id_cliente} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">ID Empleado</label>
              <input type="number" name="id_empleado" value={formData.id_empleado} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">Fecha</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
          </div>
          
          {/* Fila 2: Pago */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Método de Pago</label>
              <select name="metodo_pago" value={formData.metodo_pago} onChange={handleChange} className="mt-1 w-full input-tailwind">
                {OPCIONES_METODO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
             <div>
              <label className="label-tailwind">Estado de Pago</label>
              <select name="estado_pago" value={formData.estado_pago} onChange={handleChange} className="mt-1 w-full input-tailwind">
                {OPCIONES_ESTADO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Fila 3: Detalles de Productos (Dinámico) */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-700">Productos/Servicios</h3>
            {detalles.map((detalle, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <label className="label-tailwind text-xs">ID Producto</label>
                  <input type="number" name="id_producto" value={detalle.id_producto} onChange={e => handleDetalleChange(index, e)} className="mt-1 w-full input-tailwind" placeholder="ID Producto" />
                </div>
                <div className="col-span-3">
                  <label className="label-tailwind text-xs">Cantidad</label>
                  <input type="number" name="cantidad" value={detalle.cantidad} onChange={e => handleDetalleChange(index, e)} className="mt-1 w-full input-tailwind" placeholder="Cant." />
                </div>
                <div className="col-span-3">
                  <label className="label-tailwind text-xs">Precio Unitario ($)</label>
                  <input type="number" step="0.01" name="precio_unitario" value={detalle.precio_unitario} onChange={e => handleDetalleChange(index, e)} className="mt-1 w-full input-tailwind" placeholder="Precio" />
                </div>
                <div className="col-span-2 text-right pt-5">
                  <button type="button" onClick={() => removeDetalle(index)} className="text-red-500 hover:text-red-700" disabled={detalles.length <= 1}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
            <button type="button" onClick={addDetalle} className="text-sm btn-secondary">
              + Agregar Producto
            </button>
          </div>
          
          {/* Total y Botones */}
          <div className="flex justify-between items-center pt-4 border-t mt-6">
            <span className="text-xl font-bold text-gray-800">
              Total: ${calcularTotal().toFixed(2)}
            </span>
            <div className="flex space-x-3">
              <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
              <button type="submit" className="btn-primary">Guardar Venta</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};