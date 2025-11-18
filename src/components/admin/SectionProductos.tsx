/* eslint-disable @typescript-eslint/ban-ts-comment */
// SectionProductos.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { fetchApi } from '../../app/api'; 

// 1. Interfaz PRODUCTO
interface Producto {
  id: number; // Asumo que el ID se auto-genera
  nombre: string;
  marca: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  tipo_uso: string;
}
type CreateProductoDto = Omit<Producto, 'id'>;

// Opciones Fijas para Desplegables
const OPCIONES_CATEGORIA = ['Estética e Higiene', 'Alimentos', 'Medicamentos', 'Accesorios'];
const OPCIONES_TIPO_USO = ['Comercial', 'Clínico'];


const SectionProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Producto | null>(null);
  const [error, setError] = useState<string | null>(null);

  // --- Carga de Datos (FETCH) ---
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchApi('/producto'); 
      setProductos(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []); 

  // --- Filtros ---
  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
        const searchMatch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
        const categoriaMatch = !filtroCategoria || p.categoria === filtroCategoria;
        return searchMatch && categoriaMatch;
    });
  }, [productos, searchTerm, filtroCategoria]);

  // --- Handlers de Modales ---
  const handleOpenModalNuevo = () => { 
    setItemParaEditar(null); 
    setIsModalOpen(true); 
  };
  const handleOpenModalEditar = (item: Producto) => { 
    setItemParaEditar(item); 
    setIsModalOpen(true); 
  };
  const handleCloseModal = () => { 
    setIsModalOpen(false); 
    setItemParaEditar(null); 
  };

  // --- Handlers de CRUD ---
  const handleSave = async (data: CreateProductoDto) => {
    const dataToSend = {
      ...data,
      precio: parseFloat(data.precio.toString()),
      stock: Number(data.stock),
    };
    
    try {
      if (itemParaEditar) {
        await fetchApi(`/producto/${itemParaEditar.id}`, { 
          method: 'PUT', 
          body: JSON.stringify(dataToSend) 
        });
      } else {
        await fetchApi('/producto', { 
          method: 'POST', 
          body: JSON.stringify(dataToSend) 
        });
      }
      handleCloseModal();
      cargarDatos(); 
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await fetchApi(`/producto/${id}`, { method: 'DELETE' });
        cargarDatos(); 
      } catch (err) {
         alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Gestión de Productos</h1>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        
        {/* Barra de Filtros y Acciones */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por Nombre, Marca o Descripción..." 
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
              Nuevo Producto
            </button>
          </div>
          
          {/* Filtro de Categoría */}
          <div className="flex-1">
              <label className="label-tailwind mb-1">Categoría</label>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                className="w-full input-tailwind"
              >
                <option value="">Todas las Categorías</option>
                {OPCIONES_CATEGORIA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
        </div>

        {/* Notificación de Error */}
        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Tabla de Productos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">Marca</th>
                <th className="th-cell">Categoría</th>
                <th className="th-cell">Tipo Uso</th>
                <th className="th-cell">Precio</th>
                <th className="th-cell">Stock</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="td-center">Cargando productos...</td>
                </tr>
              ) : productosFiltrados.length === 0 ? (
                 <tr>
                  <td colSpan={7} className="td-center">
                    No se encontraron productos.
                  </td>
                </tr>
              ) : (
                productosFiltrados.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{item.nombre}</td>
                    <td className="td-cell">{item.marca}</td>
                    <td className="td-cell">{item.categoria}</td>
                    <td className="td-cell">{item.tipo_uso}</td>
                    <td className="td-cell">${item.precio.toFixed(2)}</td>
                    <td className="td-cell">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.stock < 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {item.stock}
                      </span>
                    </td>
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
        <ProductoModal
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

export default SectionProductos;

// --- COMPONENTE MODAL (ProductoModal) ---

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProductoDto) => void;
  initialData: Producto | null; 
}

const ProductoModal: React.FC<ModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    marca: initialData?.marca || '',
    descripcion: initialData?.descripcion || '',
    precio: initialData?.precio || 0,
    stock: initialData?.stock || 0,
    categoria: initialData?.categoria || OPCIONES_CATEGORIA[0],
    tipo_uso: initialData?.tipo_uso || OPCIONES_TIPO_USO[0],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          {initialData ? 'Editar Producto' : 'Agregar Producto'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          
          {/* Fila 1: Nombre y Marca */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Nombre</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">Marca</label>
              <input type="text" name="marca" value={formData.marca} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
          </div>
          
          {/* Fila 2: Categoría y Tipo Uso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Categoría</label>
              <select name="categoria" value={formData.categoria} onChange={handleChange} className="mt-1 w-full input-tailwind" required>
                {OPCIONES_CATEGORIA.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
             <div>
              <label className="label-tailwind">Tipo de Uso</label>
              <select name="tipo_uso" value={formData.tipo_uso} onChange={handleChange} className="mt-1 w-full input-tailwind" required>
                {OPCIONES_TIPO_USO.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Fila 3: Precio y Stock */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">Precio ($)</label>
              <input type="number" step="0.01" name="precio" value={formData.precio} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
            <div>
              <label className="label-tailwind">Stock</label>
              <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="mt-1 w-full input-tailwind" required />
            </div>
          </div>
          
          {/* Fila 4: Descripción */}
          <div>
            <label className="label-tailwind">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} className="mt-1 w-full input-tailwind" />
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