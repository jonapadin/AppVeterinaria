/* eslint-disable @typescript-eslint/no-explicit-any */
// SectionInventarioEmpleado.tsx
import React, { useState, useEffect } from "react";
import { Archive, Plus, Clock, Edit, Check, X } from "lucide-react";
import { fetchApi } from "../../app/api";

// --- CONFIGURACIÓN Y TIPOS ---

interface ProductoInterno {
  id: number;
  nombre: string;
  marca: string;
  stock: number;
  descripcion: string;
}

interface ItemLookup {
  id: number;
  nombre: string;
}

interface UsoInventario {
  id_uso: number;
  producto: { id: number; nombre: string; marca: string } | null; // Acepta null por si la relación falla
  empleado: { id: number; nombre: string; apellido: string } | null; // Acepta null por si la relación falla
  fecha_uso: string;
  fecha_devolucion: string | null;
  cantidad: number;
}

interface CreateUsoInventarioDto {
  id_producto: number | string;
  id_empleado: number | string;
  fecha_uso: string;
  cantidad: number | string;
}

const formatFecha = (
  isoString: string | null,
  defaultValue: string = "Pendiente"
) => {
  if (!isoString) return defaultValue;
  return new Date(isoString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ====================================================================
// Componente: UsoInventarioModal (Integrado en el mismo archivo)
// ====================================================================

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateUsoInventarioDto) => Promise<void>;
  empleados: ItemLookup[];
  productos: ItemLookup[];
}

const UsoInventarioModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSave,
  empleados,
  productos,
}) => {
  const [data, setData] = useState<Partial<CreateUsoInventarioDto>>({
    id_empleado: "",
    id_producto: "",
    cantidad: "1",
    fecha_uso: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !data.id_empleado ||
      !data.id_producto ||
      !data.cantidad ||
      !data.fecha_uso
    ) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    await onSave(data as CreateUsoInventarioDto);
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-xl font-bold mb-4">Registrar Nuevo Uso Interno</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Empleado */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Empleado:
            </label>
            <select
              name="id_empleado"
              value={data.id_empleado}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Selecciona un empleado...</option>
              {empleados.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Producto */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Producto:
            </label>
            <select
              name="id_producto"
              value={data.id_producto}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Selecciona un producto...</option>
              {productos.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Campo Cantidad */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Cantidad utilizada:
            </label>
            <input
              type="number"
              name="cantidad"
              value={data.cantidad}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          {/* Campo Fecha de Uso */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Fecha de Uso:
            </label>
            <input
              type="date"
              name="fecha_uso"
              value={data.fecha_uso}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#8F108D] text-white rounded-md hover:bg-[#7a0f78]"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Registrar Uso"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ====================================================================
// Componente Principal: SectionInventarioEmpleado
// ====================================================================

const SectionInventarioEmpleado: React.FC = () => {
  const [productosInternos, setProductosInternos] = useState<ProductoInterno[]>(
    []
  );
  const [empleadosLookup, setEmpleadosLookup] = useState<ItemLookup[]>([]);
  const [historialReservas, setHistorialReservas] = useState<UsoInventario[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editandoDevolucionId, setEditandoDevolucionId] = useState<
    number | null
  >(null);
  const [fechaDevolucionTemp, setFechaDevolucionTemp] = useState("");

  // --- Carga de Lookups y Datos ---
  const cargarEmpleadosLookup = async () => {
    try {
      const empleadosData = await fetchApi("/empleado");
      setEmpleadosLookup(
        empleadosData.map((e: any) => ({
          id: e.id,
          nombre: `${e.nombre} ${e.apellido} (ID ${e.id})`,
        }))
      );
    } catch (err) {
      setError(
        `Error al cargar la lista de empleados: ${(err as Error).message}`
      );
    }
  };

  const cargarProductosInternos = async () => {
    setLoading(true);
    setError(null);
    try {
      const productosData = await fetchApi("/productos");

      const filtrados = productosData
        .filter((p: any) => p.tipo_uso === "Interno")
        .map((p: any) => ({
          id: p.id,
          // ✅ CORRECCIÓN 1: Asegurar que 'nombre' siempre es un string válido (fallback)
          nombre:
            p.nombre ??
            `${p.marca || "Sin Marca"} - ${
              p.descripcion?.substring(0, 20) || "Sin Descripción"
            }...`,
          marca: p.marca,
          stock: p.stock,
          descripcion: p.descripcion,
        })) as ProductoInterno[];

      setProductosInternos(filtrados);
    } catch (err) {
      setError(`Error al cargar productos internos: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const cargarHistorialReservas = async () => {
    try {
      // ✅ CORRECCIÓN 2: Usar el endpoint /inventario para traer todos los registros.
      const historialData = await fetchApi(`/inventario`);
      setHistorialReservas(historialData.reverse());
    } catch (err) {
      console.error("Error cargando historial de reservas:", err);
    }
  };

  useEffect(() => {
    cargarProductosInternos();
    cargarEmpleadosLookup();
    cargarHistorialReservas();
  }, []);

  // --- Handlers de Modales ---
  const handleOpenModalNuevo = () => {
    if (empleadosLookup.length === 0) {
      alert("Cargando datos de empleados. Por favor, espere un momento.");
      return;
    }
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // --- Handler de Guardar Nuevo Uso (POST) ---
  const handleSave = async (data: CreateUsoInventarioDto) => {
    const idEmpleado = Number(data.id_empleado);
    const cantidad = Number(data.cantidad);
    const idProducto = Number(data.id_producto);

    if (!idEmpleado || isNaN(idEmpleado)) {
      alert("Error: Debe seleccionar un empleado válido.");
      return;
    }
    if (!idProducto || isNaN(idProducto)) {
      alert("Error: Debe seleccionar un producto válido.");
      return;
    }
    if (isNaN(cantidad) || cantidad <= 0) {
      alert("Error: La cantidad debe ser un número positivo.");
      return;
    }

    const dataToSend = {
      id_producto: idProducto,
      id_empleado: idEmpleado,
      fecha_uso: new Date(data.fecha_uso).toISOString(),
      cantidad: cantidad,
    };

    try {
      await fetchApi("/inventario", {
        method: "POST",
        body: JSON.stringify(dataToSend),
      });
      alert(
        `¡Uso de inventario empleado (${idEmpleado}) de (${cantidad} Uds.) de (${idProducto}) registrado con éxito!`
      );
      handleCloseModal();
      cargarProductosInternos();
      cargarHistorialReservas();
    } catch (err) {
      alert(
        `Error al registrar el uso: El Empleado o Producto no existen, o el stock es insuficiente. Detalles: ${
          (err as Error).message
        }`
      );
    }
  };

  // --- Handler para Iniciar la Edición de Devolución ---
  const handleEditDevolucion = (uso: UsoInventario) => {
    // Pre-selecciona la fecha de hoy para facilitar la devolución
    setFechaDevolucionTemp(new Date().toISOString().split("T")[0]);
    setEditandoDevolucionId(uso.id_uso);
  };

  // --- Handlers para la edición de Devolución (PATCH) ---
  const handleSaveDevolucion = async (uso: UsoInventario) => {
    if (!fechaDevolucionTemp) {
      alert("Por favor, selecciona una fecha de devolución.");
      return;
    }

    const dataToSend = {
      fecha_devolucion: new Date(fechaDevolucionTemp).toISOString(),
      cantidad: uso.cantidad,
    };

    try {
      await fetchApi(`/inventario/${uso.id_uso}`, {
        method: "PATCH",
        body: JSON.stringify(dataToSend),
      });
      alert(
        `Fecha de devolución actualizada con éxito. Stock de ${uso.cantidad} Uds. devuelto.`
      );
      setEditandoDevolucionId(null);
      setFechaDevolucionTemp("");
      cargarHistorialReservas();
      cargarProductosInternos();
    } catch (err) {
      alert(`Error al actualizar la devolución: ${(err as Error).message}`);
    }
  };

  // --- RENDER ---
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-[#8F108D]">
        Inventario Interno
      </h1>

      {error && (
        <div className="text-red-600 bg-red-100 p-3 rounded-lg">
          <strong>Error Global:</strong> {error}
        </div>
      )}

      {/* 1. SECCIÓN DE REGISTRO RÁPIDO Y STOCK INTERNO */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
          <Archive className="w-6 h-6 mr-2 text-[#8F108D]" />
          Stock de Productos de Uso Interno
        </h2>

        <button
          onClick={handleOpenModalNuevo}
          className="px-4 py-2 bg-[#8F108D] text-white rounded-md hover:bg-[#7a0f78] flex items-center justify-center w-full md:w-auto"
          disabled={loading || empleadosLookup.length === 0}
        >
          <Plus className="w-5 h-5 mr-2" />
          Registrar Nuevo Uso de Producto
        </button>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca / Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    Cargando productos internos...
                  </td>
                </tr>
              ) : productosInternos.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No hay productos marcados como uso Interno.
                  </td>
                </tr>
              ) : (
                productosInternos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{p.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {p.nombre}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                        p.stock <= 5 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {p.stock} Uds.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {p.descripcion.substring(0, 50)}...
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <hr />

      {/* 2. SECCIÓN HISTORIAL DE RESERVAS */}
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
        <h2 className="text-2xl font-semibold mb-4 flex items-center text-gray-700">
          <Clock className="w-6 h-6 mr-2 text-[#8F108D]" />
          Historial
        </h2>

        <div className="overflow-x-auto border rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID Uso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Asignado a
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha de Uso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha Devolución
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    Cargando historial...
                  </td>
                </tr>
              ) : historialReservas.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                  >
                    No hay registros de uso/reserva.
                  </td>
                </tr>
              ) : (
                historialReservas.map((uso) => (
                  <tr key={uso.id_uso} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{uso.id_uso}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {/* ✅ CORRECCIÓN 3: Uso de encadenamiento opcional para Producto */}
                      {uso.producto?.nombre ||
                        uso.producto?.marca ||
                        `[Producto ID: ${uso.producto?.id || "?"}]`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {uso.cantidad} Uds.
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* ✅ CORRECCIÓN 4: Uso de encadenamiento opcional para Empleado */}
                      {uso.empleado
                        ? `${uso.empleado.nombre} ${uso.empleado.apellido}`
                        : "[Empleado Desconocido]"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatFecha(uso.fecha_uso)}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {editandoDevolucionId === uso.id_uso ? (
                        <input
                          type="date"
                          value={fechaDevolucionTemp}
                          onChange={(e) =>
                            setFechaDevolucionTemp(e.target.value)
                          }
                          className="border border-gray-300 rounded-md p-1 w-36 text-sm"
                          required
                        />
                      ) : (
                        <span
                          className={
                            uso.fecha_devolucion
                              ? "text-green-700 font-medium"
                              : "text-yellow-600"
                          }
                        >
                          {formatFecha(uso.fecha_devolucion)}
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      {editandoDevolucionId === uso.id_uso ? (
                        <>
                          <button
                            onClick={() => handleSaveDevolucion(uso)}
                            className="text-green-600 hover:text-green-800"
                            title="Guardar Devolución"
                          >
                            <Check className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => setEditandoDevolucionId(null)}
                            className="text-red-600 hover:text-red-800"
                            title="Cancelar"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleEditDevolucion(uso)}
                          className="text-[#8F108D] hover:text-[#7a0f78]"
                          title="Registrar Devolución"
                          disabled={!!uso.fecha_devolucion}
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Registro de Uso (Definición local) */}
      {isModalOpen && (
        <UsoInventarioModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          // Aseguramos que el nombre nunca sea null/undefined para el lookup
          productos={productosInternos.map((p) => ({
            id: p.id,
            nombre: p.nombre || `Producto ${p.id}`,
          }))}
          empleados={empleadosLookup}
        />
      )}
    </div>
  );
};

export default SectionInventarioEmpleado;
