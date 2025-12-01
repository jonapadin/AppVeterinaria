/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// SectionVentas.tsx
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Eye } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api';

//  INTERFACES DE DATOS DE LA VENTA (Lo que devuelve el GET)
interface ProductoDetalle {
  id: number;
  nombre: string;
  marca: string;
  descripcion: string;
  precio: string;
  stock: number;
  categoria: string;
  // ... otras propiedades
}

interface ClienteCompleto {
  id: number;
  foto_perfil: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: number;
  telefono: string;
  ciudad: string;
  direccion: string;
}

interface EmpleadoCompleto {
  id: number;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  dni: number;
  telefono: string;
  ciudad: string;
  direccion: string;
  especialidad: string;
}

interface DetalleVenta {
  id_detalle: number;
  cantidad: number;
  precio: string;
  subtotal: number;
  producto: ProductoDetalle;
}

interface Venta {
  id_compra: number;
  fecha: string;
  total: string;
  metodo_pago: string;
  estado_pago: string;
  detalles: DetalleVenta[];
  empleado: EmpleadoCompleto;
  cliente: ClienteCompleto;
}

// INTERFACES PARA LA CREACIÓN/ACTUALIZACIÓN (Lo que espera el POST/PATCH)
type CreateVentaDto = {
  fecha: string;
  metodo_pago: string;
  estado_pago: string;
  id_cliente: number;
  id_empleado: number;
  // :  el total al DTO para el backend
  total: number;
  detalles: {
    id_producto: number;
    cantidad: number;
  }[];
};

// INTERFACES PARA LOS DESPLEGABLES (listas simplificadas)
interface ClienteSimple {
  id: number;
  nombre: string;
  apellido: string;
}

interface EmpleadoSimple {
  id: number;
  nombre: string;
  apellido: string;
}

interface ProductoSimple {
  id: number;
  nombre: string; // Contendrá la marca + descripción
  precio: string;
}


// DTO para el ESTADO del modal 
interface DetalleModalState {
  id_producto: string;
  cantidad: string;
  precio_unitario: string;
}

// Opciones (CORREGIDAS SEGÚN LOS ERRORES DEL BACKEND)
const OPCIONES_METODO_PAGO = ['Efectivo', 'Transferencia', 'Tarjeta de Crédito', 'Tarjeta de Débito'];
//Ajustar valores para que coincidan con el backend (Aprobado, Pagado)
const OPCIONES_ESTADO_PAGO = ['Pendiente', 'Aprobado', 'Cancelado', 'Pagado']; 

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
  
  const [listaClientes, setListaClientes] = useState<ClienteSimple[]>([]);
  const [listaEmpleados, setListaEmpleados] = useState<EmpleadoSimple[]>([]);
  const [listaProductos, setListaProductos] = useState<ProductoSimple[]>([]);

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      //  Cargar las listas de opciones (Clientes, Empleados, Productos)
      const [
        listData, 
        clientesData, 
        empleadosData, 
        productosData
      ] = await Promise.all([
        fetchApi('/ventas'), 
        fetchApi('/cliente'), 
        fetchApi('/empleado'), 
        fetchApi('/productos') 
      ]);

      setListaClientes(clientesData.map((c: any) => ({ id: c.id, nombre: c.nombre, apellido: c.apellido })));
      setListaEmpleados(empleadosData.map((e: any) => ({ id: e.id, nombre: e.nombre, apellido: e.apellido })));
      
      // Construir el nombre del producto usando marca y descripción 
      setListaProductos(productosData.map((p: any) => ({ 
        id: p.id, 
        nombre: `${p.marca} - ${p.descripcion}`, 
        precio: p.precio 
      })));
                
      //  Cargar detalles de cada venta para la tabla principal
      const ventasCompletas = await Promise.all(
        listData.map(async (venta: Venta) => {
          try {
            const detalles = await fetchApi(`/ventas/${venta.id_compra}`);
            return detalles; 
          } catch (err) {
            console.warn(`⚠️ Error cargando detalles de venta ${venta.id_compra}:`, err);
            return venta; 
          }
        })
      );
      
      setVentas(ventasCompletas);
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
      const idClienteStr = String(v.cliente?.id ?? '');
      const idEmpleadoStr = String(v.empleado?.id ?? '');
      const searchMatch = idClienteStr.includes(searchTerm) || idEmpleadoStr.includes(searchTerm);
      const metodoMatch = !filtroMetodoPago || v.metodo_pago === filtroMetodoPago;
      const estadoMatch = !filtroEstado || v.estado_pago === filtroEstado;
      return searchMatch && metodoMatch && estadoMatch;
    }).sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
  }, [ventas, searchTerm, filtroMetodoPago, filtroEstado]);

  // --- Handlers de Modales ---
  const handleOpenModalNuevo = () => { 
    setItemParaEditar(null); 
    setIsModalOpen(true); 
  };
  const handleOpenModalEditar = (item: Venta) => { 
    setItemParaEditar(item); 
    setIsModalOpen(true); 
  };
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
    setItemParaEditar(null); 
  };

  const handleSave = async (data: CreateVentaDto) => {
    const dataToSend = {
      ...data,
      fecha: new Date(data.fecha).toISOString(),
    };

    try {
      if (itemParaEditar) {
        await fetchApi(`/ventas/${itemParaEditar.id_compra}`, { method: 'PATCH', body: JSON.stringify(dataToSend) });
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
    if (!detalles || detalles.length === 0) return 0;
    return detalles.reduce((acc, item) => acc + (Number(item.cantidad) || 0), 0);
  };
  
  // NUEVO HANDLER: Mostrar detalles de venta
const handleShowDetalles = (detalles: DetalleVenta[], idVenta: number) => {
  if (!detalles || detalles.length === 0) {
      alert(`Venta #${idVenta} no tiene detalles de productos.`);
      return;
  }
  
  const detalleTexto = detalles.map(d => {
    //  Verifica si d.producto existe antes de intentar acceder a sus propiedades
    const nombreProducto = d.producto 
      ? (d.producto.nombre || 
         `${d.producto.marca || 'Marca Desconocida'} (${d.producto.descripcion.substring(0, 20)}...)`)
      : 'Producto no disponible'; // Mensaje de reserva si la relación no se cargó
      
    return `• ${d.cantidad}x ${nombreProducto} (P.U.: $${d.precio})`;
  }).join('\n');
  
  // Nota: El total de detalles[0].subtotal no siempre es el total de la venta, 
  // pero lo dejamos si tu API lo envía así.
  alert(`🛒 Detalles de Venta #${idVenta} (Total: $${detalles[0].subtotal || 'N/A'}):\n\n${detalleTexto}`);
};


  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8F108D]">Gestión de Ventas</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filtros y botón Nuevo */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative ">
              <input type="text" placeholder="Buscar por ID Cliente o ID Empleado..."
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button onClick={handleOpenModalNuevo} className="btn-primary bg-[#8F108D] flex items-center justify-center">
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
                <th className="th-cell">Detalles</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={9} className="td-center">Cargando ventas...</td></tr>
              ) : ventasFiltradas.length === 0 ? (
                  <tr><td colSpan={9} className="td-center">No se encontraron ventas.</td></tr>
              ) : (
                ventasFiltradas.map((item, i) => {
                  const idCliente = item.cliente?.id?.toString() ?? 'N/A';
                  const idEmpleado = item.empleado?.id?.toString() ?? 'N/A';
                  const totalItems = calcularTotalItems(item.detalles);
                  return (
                    <tr key={item.id_compra ?? `venta-${i}`} className="hover:bg-gray-50">
                      <td className="td-cell-main">#{item.id_compra}</td>
                      <td className="td-cell">{formatFechaDisplay(item.fecha)}</td>
                      <td className="td-cell">{String(idCliente)}</td>
                      <td className="td-cell">{String(idEmpleado)}</td>
                      <td className="td-cell">{String(totalItems)}</td>
                      <td className="td-cell">{item.metodo_pago}</td>
                      <td className="td-cell">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            item.estado_pago === 'Pagado' || item.estado_pago === 'Aprobado' ? 'bg-green-100 text-green-800' 
                            : item.estado_pago === 'Cancelado' ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {item.estado_pago}
                          </span>
                      </td>
                      {/* CELDA DE DETALLES */}
                      <td className="td-cell">
                        <button 
                          onClick={() => handleShowDetalles(item.detalles, item.id_compra)} 
                          className="text-primary hover:text-primary-700 p-1" 
                          data-tooltip-id="tooltip-main" 
                          data-tooltip-content="Ver Productos Vendidos"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </td>
                      {/* FIN CELDA DE DETALLES */}
                      <td className="td-cell text-right space-x-2">
                        <button onClick={() => handleOpenModalEditar(item)} className="text-primary hover:text-primary-700" data-tooltip-id="tooltip-main" data-tooltip-content="Editar">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(item.id_compra)} className="text-red-600 hover:text-red-800" data-tooltip-id="tooltip-main" data-tooltip-content="Eliminar">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                    );
                  })
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
          listaClientes={listaClientes} 
          listaEmpleados={listaEmpleados}
          listaProductos={listaProductos}
        />
      )}
      <Tooltip id="tooltip-main" />
    </div>
  );
};
export default SectionVentas;

// --- MODAL (Venta) ---
interface VentaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateVentaDto) => void;
  initialData: Venta | null;
  listaClientes: ClienteSimple[];
  listaEmpleados: EmpleadoSimple[];
  listaProductos: ProductoSimple[];
}

const VentaModal: React.FC<VentaModalProps> = ({ isOpen, onClose, onSave, initialData, listaClientes, listaEmpleados, listaProductos }) => {
  
  const getPrecioProducto = (id: string): string => {
    const prod = listaProductos.find(p => String(p.id) === id);
    return prod?.precio ?? '0.00';
  };

  const [formData, setFormData] = useState({
    fecha: initialData ? initialData.fecha.split('T')[0] : new Date().toISOString().split('T')[0],
    cliente: initialData?.cliente || { id: '', nombre: '', apellido: '' }, 
    empleado: initialData?.empleado || { id: '', nombre: '', apellido: '' },
    metodo_pago: initialData?.metodo_pago || OPCIONES_METODO_PAGO[0],
    estado_pago: initialData?.estado_pago || OPCIONES_ESTADO_PAGO[0],
  });
  
  const [detalles, setDetalles] = useState<DetalleModalState[]>(
    initialData?.detalles.map(d => ({ 
      id_producto: String(d.producto?.id ?? ''),
      cantidad: String(d.cantidad),
      precio_unitario: d.precio, 
    })) || [{ id_producto: '', cantidad: '1', precio_unitario: '0.00' }]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        // @ts-ignore
        [parent]: {
          // @ts-ignore
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetalleChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const nuevosDetalles = [...detalles];

    if (name === 'id_producto') {
      nuevosDetalles[index].id_producto = value;
      // Obtiene el precio del producto seleccionado
      nuevosDetalles[index].precio_unitario = getPrecioProducto(value); 
    } else {
      // @ts-ignore
      nuevosDetalles[index][name] = value;
    }
    setDetalles(nuevosDetalles);
  };

  const addDetalle = () => {
    setDetalles([...detalles, { id_producto: '', cantidad: '1', precio_unitario: '0.00' }]);
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
    
    // Calcula el total con la función calcularTotal()
    const totalCalculado = calcularTotal();

    //  Validación de total > 0.01 (Necesario por el error "must not be less than 0.01")
    if (totalCalculado < 0.01) {
      alert("❌ El total de la venta debe ser mayor a $0.00. Verifique los productos y cantidades.");
      return;
    }
    
    // Redondeo estricto y conversión a NUMBER (Necesario por el error "conforming to the specified constraints")
    const totalRedondeado = parseFloat(totalCalculado.toFixed(2)); 
    // toFixed(2) devuelve un string, parseFloat lo convierte de nuevo a number (ej: 10.50)

    // Asegúrate de que los IDs estén seleccionados para que el DTO sea válido
    if (!formData.cliente.id || !formData.empleado.id || detalles.filter(d => d.id_producto).length === 0) {
        alert("Por favor, selecciona un Cliente, un Empleado y al menos un Producto válido.");
        return;
    }
        
    const dataFinal: CreateVentaDto = {
        fecha: formData.fecha,
        metodo_pago: formData.metodo_pago,
        // El valor de estado_pago ya está corregido al usar las OPCIONES_ESTADO_PAGO actualizadas
        estado_pago: formData.estado_pago, 
        id_cliente: Number(formData.cliente.id),
        id_empleado: Number(formData.empleado.id),
        
        // Solución Final del Error del Total
        total: totalRedondeado, 
        
        detalles: detalles
          // Filtramos solo los detalles que tienen un producto seleccionado y una cantidad positiva
          .filter(d => d.id_producto && Number(d.cantidad) > 0) 
          .map(d => ({
            id_producto: Number(d.id_producto),
            cantidad: Number(d.cantidad),
            //  Aquí no incluimos precio_unitario, lo cual es correcto si el 
            // backend usa id_producto y total para sus validaciones internas.
          })),
    };

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
          {/*  Cliente, Empleado, Fecha */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label-tailwind">ID Cliente</label>
              <select name="cliente.id" value={formData.cliente.id} onChange={handleChange} className="mt-1 w-full input-tailwind" required>
                <option value="">Seleccionar Cliente</option>
                {listaClientes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.id} - {c.nombre} {c.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-tailwind">ID Empleado</label>
              <select name="empleado.id" value={formData.empleado.id} onChange={handleChange} className="mt-1 w-full input-tailwind" required>
                <option value="">Seleccionar Empleado</option>
                {listaEmpleados.map(e => (
                  <option key={e.id} value={e.id}>
                    {e.id} - {e.nombre} {e.apellido}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-tailwind">Fecha</label>
              <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
          </div>
          
          {/* Pago */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Método de Pago</label>
              <select name="metodo_pago" value={formData.metodo_pago} onChange={handleChange} className="mt-1 w-full input-tailwind">
                {OPCIONES_METODO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
              <div>
              <label className="label-tailwind">Estado de Pago</label>
              {/* Usa las opciones corregidas OPCIONES_ESTADO_PAGO */}
              <select name="estado_pago" value={formData.estado_pago} onChange={handleChange} className="mt-1 w-full input-tailwind">
                {OPCIONES_ESTADO_PAGO.map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>

          {/* Detalles de Productos (Dinámico) */}
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-lg font-medium text-gray-700">Productos/Servicios</h3>
            {detalles.map((detalle, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center">
                <div className="col-span-4">
                  <label className="label-tailwind text-xs">ID Producto</label>
                  <select name="id_producto" value={detalle.id_producto} onChange={e => handleDetalleChange(index, e)} className="mt-1 w-full input-tailwind" required>
                    <option value="">Seleccionar Producto</option>
                    {listaProductos.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.id} - {p.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-3">
                  <label className="label-tailwind text-xs">Cantidad</label>
                  <input type="number" name="cantidad" value={detalle.cantidad} onChange={e => handleDetalleChange(index, e)} className="mt-1 w-full input-tailwind" placeholder="Cant." min="1" required />
                </div>
                <div className="col-span-3">
                  <label className="label-tailwind text-xs">Precio Unitario ($)</label>
                  <input type="text" name="precio_unitario" value={detalle.precio_unitario} 
                    className="mt-1 w-full input-tailwind bg-gray-100" placeholder="Precio" readOnly />
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