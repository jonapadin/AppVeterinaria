// SectionVentas.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

// 1. Definimos el TIPO de dato
type MetodoPago = 'Efectivo' | 'Tarjeta' | 'Transferencia';
type EstadoVenta = 'Pagada' | 'Pendiente';

interface Venta {
  id: string;
  fecha: Date;
  clienteEmail: string;
  productoNombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
  metodoPago: MetodoPago;
  estado: EstadoVenta;
}

// DATOS DE EJEMPLO
const MOCK_VENTAS: Venta[] = [
  { id: 'v1', fecha: new Date('2025-11-04T10:30:00'), clienteEmail: 'pepito@gmail.com', productoNombre: 'Bolsa Alimento 10kg', cantidad: 1, precioUnitario: 50, total: 50, metodoPago: 'Tarjeta', estado: 'Pagada' },
  { id: 'v2', fecha: new Date('2025-11-03T15:00:00'), clienteEmail: 'ana.martinez@web.com', productoNombre: 'Consulta General', cantidad: 1, precioUnitario: 30, total: 30, metodoPago: 'Efectivo', estado: 'Pagada' },
  { id: 'v3', fecha: new Date('2025-11-02T09:00:00'), clienteEmail: 'carlos.s@demo.es', productoNombre: 'Vacuna Antirrábica', cantidad: 2, precioUnitario: 25, total: 50, metodoPago: 'Transferencia', estado: 'Pendiente' },
];

// Opciones para los filtros
const OPCIONES_METODO_PAGO: MetodoPago[] = ['Efectivo', 'Tarjeta', 'Transferencia'];
const OPCIONES_ESTADO_VENTA: EstadoVenta[] = ['Pagada', 'Pendiente'];


const SectionVentas: React.FC = () => {
  // --- ESTADOS ---
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroMetodoPago, setFiltroMetodoPago] = useState<MetodoPago | ''>('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoVenta | ''>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ventaParaEditar, setVentaParaEditar] = useState<Venta | null>(null);

  // --- EFECTOS ---
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setVentas(MOCK_VENTAS);
      setLoading(false);
    }, 1000);
  }, []);

  // --- FILTROS (useMemo) ---
  const ventasFiltradas = useMemo(() => {
    let filtradas = ventas;

    if (searchTerm) {
      filtradas = filtradas.filter(v =>
        v.clienteEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.productoNombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filtroMetodoPago) {
      filtradas = filtradas.filter(v => v.metodoPago === filtroMetodoPago);
    }
    if (filtroEstado) {
      filtradas = filtradas.filter(v => v.estado === filtroEstado);
    }

    return filtradas.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
  }, [ventas, searchTerm, filtroMetodoPago, filtroEstado]);

  // --- MANEJADORES DE ACCIONES (CRUD) ---
  const handleOpenModalNuevo = () => {
    setVentaParaEditar(null);
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (venta: Venta) => {
    setVentaParaEditar(venta);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setVentaParaEditar(null);
  };
  const handleSaveVenta = (data: Omit<Venta, 'id' | 'total'>) => {
    const total = data.cantidad * data.precioUnitario;
    
    if (ventaParaEditar) {
      const ventaActualizada = { ...ventaParaEditar, ...data, total };
      setVentas(
        ventas.map((v) =>
          v.id === ventaParaEditar.id ? ventaActualizada : v
        )
      );
    } else {
      const nuevaVenta: Venta = {
        id: (Math.random() * 1000).toString(),
        ...data,
        total,
      };
      setVentas([nuevaVenta, ...ventas]);
    }
    handleCloseModal();
  };
  const handleDeleteVenta = (id: string) => {
    if (window.confirm('¿Seguro que deseas eliminar esta venta?')) {
      setVentas(ventas.filter((v) => v.id !== id));
    }
  };

  // --- Helpers de Formato ---
  const formatFecha = (date: Date) => {
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
  }

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
        Gestión de Ventas
      </h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input type="text" placeholder="Buscar por Cliente o Producto..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <select value={filtroMetodoPago} onChange={(e) => setFiltroMetodoPago(e.target.value as MetodoPago | '')} className="input-tailwind w-full">
                <option value="">Todos los Métodos</option>
                {OPCIONES_METODO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado de Venta</label>
              <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value as EstadoVenta | '')} className="input-tailwind w-full">
                <option value="">Todos los Estados</option>
                {OPCIONES_ESTADO_VENTA.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Ventas */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="th-cell">Fecha</th>
                <th className="th-cell">Cliente (Email)</th>
                <th className="th-cell">Producto</th>
                <th className="th-cell">Cant.</th>
                <th className="th-cell">P. Unit.</th>
                <th className="th-cell">Total</th>
                <th className="th-cell">Método Pago</th>
                <th className="th-cell">Estado</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={9} className="td-center">Cargando ventas...</td></tr>
              ) : ventasFiltradas.length === 0 ? (
                 <tr><td colSpan={9} className="td-center">No se encontraron ventas con esos filtros.</td></tr>
              ) : (
                ventasFiltradas.map((venta) => (
                  <tr key={venta.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="td-cell">{formatFecha(venta.fecha)}</td>
                    <td className="td-cell">{venta.clienteEmail}</td>
                    <td className="td-cell font-medium text-gray-900 dark:text-white">{venta.productoNombre}</td>
                    <td className="td-cell">{venta.cantidad}</td>
                    <td className="td-cell">{formatCurrency(venta.precioUnitario)}</td>
                    <td className="td-cell font-bold text-gray-900 dark:text-white">{formatCurrency(venta.total)}</td>
                    <td className="td-cell">{venta.metodoPago}</td>
                    <td className="td-cell">
                       <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                         venta.estado === 'Pagada' 
                           ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                           : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                       }`}>
                        {venta.estado}
                       </span>
                    </td>
                    <td className="td-cell text-right space-x-2">
                      <button onClick={() => handleOpenModalEditar(venta)} className="text-blue-600 hover:text-blue-800" data-tooltip-id="tooltip-main" data-tooltip-content="Editar Venta">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => handleDeleteVenta(venta.id)} className="text-red-600 hover:text-red-800" data-tooltip-id="tooltip-main" data-tooltip-content="Eliminar Venta">
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
          onSave={handleSaveVenta}
          initialData={ventaParaEditar}
        />
      )}
      <Tooltip id="tooltip-main" />
    </div>
  );
};

export default SectionVentas;

// --- COMPONENTE MODAL (VentaModal) ---

interface VentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Venta, 'id' | 'total'>) => void;
  initialData: Venta | null;
}

const VentaModal: React.FC<VentaModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  const [fechaStr, setFechaStr] = useState(
    initialData ? dateToLocalISOString(initialData.fecha) : dateToLocalISOString(new Date())
  );
  const [clienteEmail, setClienteEmail] = useState(initialData?.clienteEmail || '');
  const [productoNombre, setProductoNombre] = useState(initialData?.productoNombre || '');
  const [cantidad, setCantidad] = useState(initialData?.cantidad || 1);
  const [precioUnitario, setPrecioUnitario] = useState(initialData?.precioUnitario || 0);
  const [metodoPago, setMetodoPago] = useState<MetodoPago>(initialData?.metodoPago || 'Efectivo');
  const [estado, setEstado] = useState<EstadoVenta>(initialData?.estado || 'Pendiente');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fechaStr || !clienteEmail || !productoNombre || cantidad <= 0 || precioUnitario < 0) {
      alert('Por favor, completa todos los campos correctamente.');
      return;
    }
    
    onSave({ 
      fecha: new Date(fechaStr),
      clienteEmail, 
      productoNombre, 
      cantidad,
      precioUnitario,
      metodoPago, 
      estado 
    });
  };

  if (!isOpen) return null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function formatCurrency(_arg0: number): React.ReactNode {
        throw new Error('Function not implemented.');
    }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
          {initialData ? 'Editar Venta' : 'Registrar Venta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Fecha y Hora</label>
              <input type="datetime-local" value={fechaStr} onChange={(e) => setFechaStr(e.target.value)}
                className="mt-1 w-full input-tailwind" />
            </div>
             <div>
              <label className="label-tailwind">Email del Cliente</label>
              <input type="email" value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)}
                className="mt-1 w-full input-tailwind" />
            </div>
          </div>
          
          <div>
            <label className="label-tailwind">Nombre del Producto o Servicio</label>
            <input type="text" value={productoNombre} onChange={(e) => setProductoNombre(e.target.value)}
              className="mt-1 w-full input-tailwind" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Cantidad</label>
              <input type="number" min="1" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))}
                className="mt-1 w-full input-tailwind" />
            </div>
            <div>
              <label className="label-tailwind">Precio Unitario ($)</label>
              <input type="number" min="0" step="0.01" value={precioUnitario} onChange={(e) => setPrecioUnitario(Number(e.target.value))}
                className="mt-1 w-full input-tailwind" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Método de Pago</label>
              <select value={metodoPago} onChange={(e) => setMetodoPago(e.target.value as MetodoPago)}
                className="mt-1 w-full input-tailwind">
                {OPCIONES_METODO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
             <div>
              <label className="label-tailwind">Estado de Venta</label>
              <select value={estado} onChange={(e) => setEstado(e.target.value as EstadoVenta)}
                className="mt-1 w-full input-tailwind">
                {OPCIONES_ESTADO_VENTA.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-2 text-right">
            <span className="text-lg font-bold text-gray-800 dark:text-white">
              Total: {formatCurrency(cantidad * precioUnitario)}
            </span>
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

function dateToLocalISOString(fecha: Date): string {
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
