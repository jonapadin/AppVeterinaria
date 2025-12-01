import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api'; 

// 1. Interfaz USO DE INVENTARIO
interface UsoInventario {
  id: number;
  id_producto: number;
  id_empleado: number;
  fecha_uso: string;
}
type CreateUsoInventarioDto = Omit<UsoInventario, 'id'>;

// Interfaces para los desplegables
interface ItemLookup {
  id: number;
  nombre: string;
}

const formatFechaDisplay = (isoString: string) => {
  if (!isoString) return 'Fecha inválida';
  return new Date(isoString).toLocaleString('es-ES', { 
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' 
  });
};
const dateToLocalISOString = (date: Date): string => {
  const tzoffset = (new Date()).getTimezoneOffset() * 60000;
  const localISOTime = (new Date(date.getTime() - tzoffset)).toISOString().slice(0, 16);
  return localISOTime;
};


const SectionInventario: React.FC = () => {
  const [usos, setUsos] = useState<UsoInventario[]>([]);
  const [productosLookup, setProductosLookup] = useState<ItemLookup[]>([]);
  const [empleadosLookup, setEmpleadosLookup] = useState<ItemLookup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<UsoInventario | null>(null);
  const [error, setError] = useState<string | null>(null);

  //  Carga de Datos (FETCH) 
  const cargarLookups = async () => {
    try {
      const empleadosData = await fetchApi('/empleado');
      setEmpleadosLookup(empleadosData.map((e: any) => ({ 
        id: e.id, 
        nombre: `${e.nombre} ${e.apellido || ''}` 
      })));
      
      const productosData = await fetchApi('/producto');
      setProductosLookup(productosData.map((p: any) => ({ 
        id: p.id, 
        nombre: p.nombre 
      })));

    } catch (err) {
       setError(`Error al cargar listas: ${(err as Error).message}`);
    }
  };
  
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const usosData = await fetchApi('/inventario'); // Endpoint para los registros de uso
      setUsos(usosData);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLookups();
    cargarDatos();
  }, []); 

  //  Helpers de Lookup 
  const getProductoNombre = (id: number) => productosLookup.find(p => p.id === id)?.nombre || `(ID Prod: ${id})`;
  const getEmpleadoNombre = (id: number) => empleadosLookup.find(e => e.id === id)?.nombre || `(ID Emp: ${id})`;

  //  Filtros 
  const usosFiltrados = useMemo(() => {
    if (productosLookup.length === 0 || empleadosLookup.length === 0) return [];
    
    return usos.filter((u) => {
        const prodNombre = getProductoNombre(u.id_producto).toLowerCase();
        const empNombre = getEmpleadoNombre(u.id_empleado).toLowerCase();
        
        return prodNombre.includes(searchTerm.toLowerCase()) ||
               empNombre.includes(searchTerm.toLowerCase()) ||
               u.id_producto.toString().includes(searchTerm) ||
               u.id_empleado.toString().includes(searchTerm);
    }).sort((a, b) => new Date(b.fecha_uso).getTime() - new Date(a.fecha_uso).getTime()); // Ordenar por fecha reciente
  }, [usos, searchTerm, productosLookup, empleadosLookup]);

  //  Handlers de Modales 
  const handleOpenModalNuevo = () => { 
    setItemParaEditar(null); 
    setIsModalOpen(true); 
  };
  const handleOpenModalEditar = (item: UsoInventario) => { 
    setItemParaEditar(item); 
    setIsModalOpen(true); 
  };
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
    setItemParaEditar(null); 
  };

  //  Handlers de CRUD 
  const handleSave = async (data: CreateUsoInventarioDto) => {
    const dataToSend = {
      ...data,
      id_producto: Number(data.id_producto),
      id_empleado: Number(data.id_empleado),
      fecha_uso: new Date(data.fecha_uso).toISOString(),
    };
    
    try {
      if (itemParaEditar) {
        await fetchApi(`/inventario/${itemParaEditar.id}`, { 
          method: 'PATCH', 
          body: JSON.stringify(dataToSend) 
        });
      } else {
        await fetchApi('/inventario', { 
          method: 'POST', 
          body: JSON.stringify(dataToSend) 
        });
      }
      handleCloseModal();
      cargarDatos(); 
      cargarLookups(); // Recargar lookups por si se actualizó el stock implícitamente
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de uso?')) {
      try {
        await fetchApi(`/inventario/${id}`, { method: 'DELETE' });
        cargarDatos(); 
        cargarLookups(); // Recargar lookups por si se actualizó el stock implícitamente
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  //  RENDER 
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Consumo de Inventario</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        
        {/* Barra de Filtros y Acciones */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="relative w-full md:w-1/3">
            <input
              type="text"
              placeholder="Buscar por Producto o Empleado..." 
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
            Registrar Uso
          </button>
        </div>

        {/* Notificación de Error */}
        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Tabla de Usos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">Fecha de Uso</th>
                <th className="th-cell">Producto Consumido</th>
                <th className="th-cell">Empleado</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading || productosLookup.length === 0 || empleadosLookup.length === 0 ? (
                <tr>
                  <td colSpan={4} className="td-center">Cargando inventario y listas...</td>
                </tr>
              ) : usosFiltrados.length === 0 ? (
                 <tr>
                  <td colSpan={4} className="td-center">
                    No se encontraron registros de uso.
                  </td>
                </tr>
              ) : (
                usosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{formatFechaDisplay(item.fecha_uso)}</td>
                    <td className="td-cell">{getProductoNombre(item.id_producto)}</td>
                    <td className="td-cell">{getEmpleadoNombre(item.id_empleado)}</td>
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
        <UsoInventarioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={itemParaEditar}
          productos={productosLookup}
          empleados={empleadosLookup}
        />
      )}

      <Tooltip id="tooltip-main" />
    </div>
  );
};

export default SectionInventario;

//  COMPONENTE MODAL (UsoInventarioModal) 

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUsoInventarioDto) => void;
  initialData: UsoInventario | null; 
  productos: ItemLookup[];
  empleados: ItemLookup[];
}

export const UsoInventarioModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData, productos, empleados }) => {
  
  const [formData, setFormData] = useState({
    id_producto: initialData?.id_producto || '',
    id_empleado: initialData?.id_empleado || '',
    fecha_uso: initialData ? dateToLocalISOString(new Date(initialData.fecha_uso)) : dateToLocalISOString(new Date()),
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // @ts-ignore
    onSave(formData);
  };

  if (!isOpen) return null;

  // Asegurar que haya opciones válidas para los desplegables
  const productoOptions = productos.filter(p => p.id);
  const empleadoOptions = empleados.filter(e => e.id);


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? 'Editar Registro de Uso' : 'Registrar Uso de Inventario'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Fila 1: Producto */}
          <div>
            <label className="label-tailwind">Producto Consumido</label>
            <select name="id_producto" value={formData.id_producto} onChange={handleChange} className="mt-1 w-full input-tailwind" required disabled={productoOptions.length === 0}>
              <option value="" disabled>Seleccione un producto</option>
              {productoOptions.map(p => (
                <option key={p.id} value={p.id}>{p.nombre}</option>
              ))}
            </select>
          </div>
          
          {/* Fila 2: Empleado */}
          <div>
            <label className="label-tailwind">Empleado que Usó el Producto</label>
            <select name="id_empleado" value={formData.id_empleado} onChange={handleChange} className="mt-1 w-full input-tailwind" required disabled={empleadoOptions.length === 0}>
              <option value="" disabled>Seleccione un empleado</option>
              {empleadoOptions.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>

          {/* Fila 3: Fecha de Uso */}
          <div>
            <label className="label-tailwind">Fecha y Hora de Uso</label>
            <input type="datetime-local" name="fecha_uso" value={formData.fecha_uso} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" className="btn-primary" disabled={productoOptions.length === 0 || empleadoOptions.length === 0}>
              Guardar Registro
            </button>
          </div>
        </form>
        {(productoOptions.length === 0 || empleadoOptions.length === 0) && (
             <p className="text-red-500 mt-2 text-sm">Asegúrese de tener productos y empleados registrados para crear un uso.</p>
        )}
      </div>
    </div>
  );
};