import React, { useState, useMemo, useEffect } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { fetchApi } from "../../app/api";

// INTERFACES 
interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  peso: number;
  esterilizado: boolean;
  foto: string;
  observaciones: string;
}

interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  mascotas?: Mascota[];
}

// INTERFACES PARA EL COMPONENTE 
interface MascotaConCliente extends Mascota {
  cliente_id: number;
  cliente: Cliente; // Usada solo para el renderizado
}
type CreateMascotaDto = Omit<Mascota, "id"> & { cliente_id: string | number };

const SectionMascotas: React.FC = () => {
  const [mascotasConCliente, setMascotasConCliente] = useState<
    MascotaConCliente[]
  >([]);
  const [clientes, setClientes] = useState<Cliente[]>([]); // Lista completa de clientes
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroEspecie, setFiltroEspecie] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] =
    useState<MascotaConCliente | null>(null);
  const [error, setError] = useState<string | null>(null);

  const OPCIONES_ESPECIE = ["Perro", "Gato", "Otro"];

  // 1. Función para cargar datos
  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientesData: Cliente[] = await fetchApi("/cliente");
      setClientes(clientesData);

      const listadoAplanado: MascotaConCliente[] = clientesData.flatMap(
        (cliente) =>
          cliente.mascotas?.map((mascota) => ({
            ...mascota,
            cliente_id: cliente.id, // Adjuntamos el ID del cliente al objeto mascota
            cliente: cliente, // Adjuntamos el objeto cliente (para evitar re-búsquedas)
          })) || []
      );
      setMascotasConCliente(listadoAplanado);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    cargarDatos();
  }, []);

  // Filtrado 
  const mascotasFiltradas = useMemo(() => {
    return mascotasConCliente.filter((m) => {
      const searchTermLower = searchTerm.toLowerCase();

      const clienteNombre = m.cliente?.nombre ?? "";
      const clienteApellido = m.cliente?.apellido ?? "";

      // Convertimos el ID del cliente a string
      const clienteIdStr = m.cliente_id?.toString() ?? "";

      const searchMatch =
        m.nombre.toLowerCase().includes(searchTermLower) ||
        m.raza.toLowerCase().includes(searchTermLower) ||
        clienteNombre.toLowerCase().includes(searchTermLower) ||
        clienteApellido.toLowerCase().includes(searchTermLower) ||
        clienteIdStr.includes(searchTermLower);

      const especieMatch = !filtroEspecie || m.especie === filtroEspecie;

      return searchMatch && especieMatch;
    });
  }, [mascotasConCliente, searchTerm, filtroEspecie]);

  // Handlers de Modales
  const handleOpenModalNuevo = () => {
    setItemParaEditar(null);
    setIsModalOpen(true);
  };
  const handleOpenModalEditar = (item: MascotaConCliente) => {
    setItemParaEditar(item);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setItemParaEditar(null);
  };

  // Handlers de CRUD
  const handleSave = async (data: CreateMascotaDto) => {
    const dataToSend = {
      ...data,
      cliente_id: Number(data.cliente_id), // Convertimos a número para el backend
      edad: Number(data.edad),
      peso: parseFloat(data.peso.toString()),
      esterilizado: Boolean(data.esterilizado),
      // @ts-ignore
      cliente: undefined,
    };

    try {
      if (itemParaEditar) {
        await fetchApi(`/mascotas/${itemParaEditar.id}`, {
          method: "PATCH",
          body: JSON.stringify(dataToSend),
        });
      } else {
        await fetchApi("/mascotas", {
          method: "POST",
          body: JSON.stringify(dataToSend),
        });
      }
      handleCloseModal();
      cargarDatos(); // Recargar datos de clientes y mascotas
    } catch (err) {
      alert(`Error al guardar: ${(err as Error).message}`);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Seguro que deseas eliminar esta mascota?")) {
      try {
        await fetchApi(`/mascotas/${id}`, { method: "DELETE" });
        cargarDatos();
      } catch (err) {
        alert(`Error al eliminar: ${(err as Error).message}`);
      }
    }
  };

  // RENDER Y CORRECCIÓN DE HYDRATION
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-[#8F108D]">Gestión de Mascotas</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Barra de Filtros */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative ">
              <input
                type="text"
                placeholder="Buscar por Nombre, Raza, ID Cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleOpenModalNuevo}
              className="btn-primary bg-[#8F108D] flex items-center justify-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Mascota
            </button>
          </div>
          {/* Filtro de Especie */}
          <div className="flex-1">
            <label className="label-tailwind mb-1">Especie</label>
            <select
              value={filtroEspecie}
              onChange={(e) => setFiltroEspecie(e.target.value)}
              className="w-full input-tailwind"
            >
              <option value="">Todas las Especies</option>
              {OPCIONES_ESPECIE.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded-lg mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Tabla de Mascotas  */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">Nombre</th>
                <th className="th-cell">ID Cliente</th>
                <th className="th-cell">Especie</th>
                <th className="th-cell">Raza</th>
                <th className="th-cell">Edad (años)</th>
                <th className="th-cell">Peso (kg)</th>
                <th className="th-cell">Esterilizado</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="td-center">
                    Cargando mascotas...
                  </td>
                </tr>
              ) : mascotasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={8} className="td-center">
                    No se encontraron mascotas.
                  </td>
                </tr>
              ) : (
                mascotasFiltradas.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="td-cell-main">{item.nombre}</td>
                    {/* Muestra el ID del cliente y su nombre */}
                    <td className="td-cell">
                      {item.cliente_id} - (
                      {item.cliente?.nombre ?? "Desconocido"})
                    </td>
                    <td className="td-cell">{item.especie}</td>
                    <td className="td-cell">{item.raza}</td>
                    <td className="td-cell">{item.edad}</td>
                    <td className="td-cell">{item.peso}</td>
                    <td className="td-cell">
                      {item.esterilizado ? "Sí" : "No"}
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
        <MascotaModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={itemParaEditar}
          clientesList={clientes} // Pasamos la lista completa de clientes
        />
      )}
      <Tooltip id="tooltip-main" />{" "}
    </div>
  );
};
export default SectionMascotas;

// MODAL 
interface MascotaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateMascotaDto) => void;
  initialData: MascotaConCliente | null;
  clientesList: Cliente[];
}

const MascotaModal: React.FC<MascotaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  clientesList,
}) => {
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || "", // Cliente_id es requerido para el POST/PATCH de la API
    cliente_id: initialData?.cliente_id?.toString() || "",
    especie: initialData?.especie || "Perro",
    raza: initialData?.raza || "",
    edad: initialData?.edad || 0,
    peso: initialData?.peso || 0,
    esterilizado: initialData?.esterilizado || false,
    foto: initialData?.foto || "",
    observaciones: initialData?.observaciones || "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // @ts-ignore
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
     <div className="fixed inset-0 z-50 flex items-center justify-center bg-opaque-50  bg-opacity-60 backdrop-blur-sm p-4">
      {" "}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        {" "}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? "Editar Mascota" : "Agregar Mascota"}{" "}
        </h2>{" "}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-h-[70vh] overflow-y-auto pr-2"
        >
          {/*  Nombre */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              <label className="label-tailwind">Nombre</label>{" "}
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
                required
              />{" "}
            </div>{" "}
            <div>
              {" "}
              <label className="label-tailwind">
                Cliente (ID y Nombre)
              </label>{" "}
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
                required
              >
                <option value="" disabled>
                  Seleccione un Cliente
                </option>{" "}
                {clientesList.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nombre} {cliente.apellido} (ID: {cliente.id}){" "}
                  </option>
                ))}{" "}
              </select>{" "}
            </div>{" "}
          </div>
          {/* Fila 2 en adelante */}{" "}
          <div className="grid grid-cols-2 gap-4">
            {" "}
            <div>
              <label className="label-tailwind">Especie</label>{" "}
              <select
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
              >
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>{" "}
                <option value="Otro">Otro</option>{" "}
              </select>{" "}
            </div>{" "}
            <div>
              <label className="label-tailwind">Raza</label>{" "}
              <input
                type="text"
                name="raza"
                value={formData.raza}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
                required
              />{" "}
            </div>{" "}
          </div>{" "}
          <div className="grid grid-cols-3 gap-4 items-center">
            {" "}
            <div>
              {" "}
              <label className="label-tailwind">Edad (años)</label>{" "}
              <input
                type="number"
                name="edad"
                value={formData.edad}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
              />{" "}
            </div>{" "}
            <div>
              <label className="label-tailwind">Peso (kg)</label>{" "}
              <input
                type="number"
                step="0.1"
                name="peso"
                value={formData.peso}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
              />{" "}
            </div>{" "}
            <div className="pt-6">
              {" "}
              <label className="flex items-center space-x-2">
                {" "}
                <input
                  type="checkbox"
                  name="esterilizado"
                  checked={formData.esterilizado}
                  onChange={handleChange}
                  className="h-5 w-5 text-primary focus:ring-primary border-gray-300 rounded"
                />{" "}
                <span className="label-tailwind">Esterilizado</span>{" "}
              </label>{" "}
            </div>{" "}
          </div>{" "}
          <div>
            <label className="label-tailwind">URL Foto</label>{" "}
            <input
              type="text"
              name="foto"
              value={formData.foto}
              onChange={handleChange}
              className="mt-1 w-full input-tailwind"
            />{" "}
          </div>{" "}
          <div>
            <label className="label-tailwind">Observaciones</label>{" "}
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full input-tailwind"
            />{" "}
          </div>
          {/* Botones */}{" "}
          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            {" "}
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancelar
            </button>{" "}
            <button type="submit" className="btn-primary bg-[#8F108D]">
              Guardar
            </button>{" "}
          </div>{" "}
        </form>{" "}
      </div>{" "}
    </div>
  );
};
