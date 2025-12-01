import React, { useState, useMemo, useEffect } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { fetchApi } from "../../app/api";

// CONSTANTES
const OPCIONES_TIPO_TURNO = [
  "consulta",
  "vacunacion",
  "peluqueria",
  "urgencia",
];
const OPCIONES_ESTADO_TURNO = ["pendiente", "completado", "cancelado"];

// INTERFACES
interface ClienteSimple {
  id: number;
  nombre: string;
  mascotas?: MascotaSimple[];
}

interface MascotaSimple {
  id: number;
  nombre: string;
  id_mascota?: number;
  cliente_id?: number;
}

interface Turno {
  id_turno: number;
  fecha_turno: string; // ISO string
  tipo: (typeof OPCIONES_TIPO_TURNO)[number];
  estado: (typeof OPCIONES_ESTADO_TURNO)[number];
  observaciones: string;
  cliente_id: number;
  mascota_id?: number;
  cliente?: ClienteSimple;
}

type CreateTurnoDto = Omit<Turno, "id_turno" | "cliente" | "cliente_id"> & {
  cliente_id: string;
};

// HELPERS
const dateToLocalISOString = (date: Date) => {
  const tzoffset = new Date().getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzoffset).toISOString().slice(0, 16);
};

const formatFechaDisplay = (isoString: string) =>
  new Date(isoString).toLocaleString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// --- COMPONENTES AUXILIARES PARA REEMPLAZAR ALERT/CONFIRM ---

interface MessageProps {
  message: string;
  type: "error" | "success";
  onClose: () => void;
}

const NotificationMessage: React.FC<MessageProps> = ({
  message,
  type,
  onClose,
}) => {
  const bgColor = type === "error" ? "bg-red-500" : "bg-green-500";
  const icon =
    type === "error" ? (
      <AlertTriangle className="w-5 h-5 mr-2" />
    ) : (
      <Plus className="w-5 h-5 mr-2" />
    );

  // Auto-cierre para mensajes de éxito
  useEffect(() => {
    if (type === "success") {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  return (
    <div
      className={`fixed top-4 right-4  p-4 rounded-lg shadow-2xl text-white max-w-sm flex items-center ${bgColor}`}
    >
      {icon}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface CustomConfirmProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const CustomConfirmModal: React.FC<CustomConfirmProps> = ({
  title,
  message,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
    <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm animate-in fade-in zoom-in">
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex justify-end space-x-3">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-200"
        >
          Confirmar
        </button>
      </div>
    </div>
  </div>
);

// ---------------------------------------
// MODAL PARA TURNOS CON CLIENTES

interface TurnoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTurnoDto) => Promise<void>; // Retorna promesa para manejar la espera
  initialData: Turno | null;
  clientes: ClienteSimple[];
  mascotas: MascotaSimple[]; // Se añade mascotas ya que se cargan
}

const TurnoModal: React.FC<TurnoModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  clientes,
  mascotas,
}) => {
  const initialMascota = initialData
    ? mascotas.find((m) => m.id === initialData.mascota_id)
    : null;
  const initialClienteId =
    initialMascota?.cliente_id?.toString() ||
    initialData?.cliente_id?.toString() ||
    "";

  const [formData, setFormData] = useState({
    cliente_id: initialClienteId, // string
    mascota_id: initialData?.mascota_id?.toString() || "", // string
    fecha_turno: initialData
      ? dateToLocalISOString(new Date(initialData.fecha_turno))
      : dateToLocalISOString(new Date()),
    tipo: initialData?.tipo || OPCIONES_TIPO_TURNO[0],
    estado: initialData?.estado || OPCIONES_ESTADO_TURNO[0],
    observaciones: initialData?.observaciones || "",
  });
  const [isSaving, setIsSaving] = useState(false);

  const mascotasFiltradas = useMemo(() => {
    const cliente = clientes.find((c) => c.id === Number(formData.cliente_id));
    return cliente?.mascotas || [];
  }, [clientes, formData.cliente_id]);

  // Si el cliente cambia, aseguramos que la mascota seleccionada siga siendo válida, si no, la limpiamos.
  useEffect(() => {
    const clienteId = Number(formData.cliente_id);
    const mascotaSeleccionadaId = Number(formData.mascota_id);

    if (mascotaSeleccionadaId && clienteId) {
      const isValid = mascotas.some(
        (m) =>
          m.id_mascota === mascotaSeleccionadaId && m.cliente_id === clienteId,
      );
      if (!isValid) {
        setFormData((prev) => ({ ...prev, mascota_id: "" }));
      }
    }
  }, [formData.cliente_id, mascotas]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    if (name === "cliente_id") {
      setFormData((prev) => ({
        ...prev,
        cliente_id: value,
        mascota_id: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    setIsSaving(true);
    try {
      // Convertimos a los tipos correctos para enviar
      const dataToSend: CreateTurnoDto = {
        cliente_id: formData.cliente_id, // string
        mascota_id: formData.mascota_id
          ? Number(formData.mascota_id)
          : undefined, // opcional
        fecha_turno: formData.fecha_turno,
        tipo: formData.tipo,
        estado: formData.estado,
        observaciones: formData.observaciones,
      };

      await onSave(dataToSend);
    } catch (err) {
      console.error("Error en handleSubmit modal:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg animate-in fade-in slide-in-from-top-1/2">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          {initialData ? "Editar Turno" : "Agregar Turno"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Cliente */}
          <div>
            <label className="label-tailwind">
              Cliente <span className="text-red-500">*</span>
            </label>
            <select
              name="cliente_id"
              value={formData.cliente_id}
              onChange={handleChange}
              className="mt-1 w-full input-tailwind"
              required
              disabled={isSaving}
            >
              <option value="" disabled>
                Seleccione un cliente
              </option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} (ID: {c.id})
                </option>
              ))}
            </select>
          </div>

          {/* Mascota (Opcional, pero incluido para funcionalidad) */}
          <div>
            <label className="label-tailwind">Mascota</label>
            <select
              name="mascota_id"
              value={formData.mascota_id}
              onChange={handleChange}
              disabled={!formData.cliente_id || mascotasFiltradas.length === 0}
            >
              <option value="">
                {formData.cliente_id
                  ? mascotasFiltradas.length > 0
                    ? "Seleccione la mascota"
                    : "No hay mascotas para este cliente"
                  : "Primero seleccione un cliente"}
              </option>
              {mascotasFiltradas.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} (id: {m.id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label-tailwind">
              Fecha y Hora <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              name="fecha_turno"
              value={formData.fecha_turno}
              onChange={handleChange}
              className="mt-1 w-full input-tailwind"
              required
              disabled={isSaving}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-tailwind">
                Tipo de Turno <span className="text-red-500">*</span>
              </label>
              <select
                name="tipo"
                value={formData.tipo}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
                required
                disabled={isSaving}
              >
                {OPCIONES_TIPO_TURNO.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label-tailwind">
                Estado del Turno <span className="text-red-500">*</span>
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="mt-1 w-full input-tailwind"
                required
                disabled={isSaving}
              >
                {OPCIONES_ESTADO_TURNO.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label-tailwind">
              Observaciones <span className="text-red-500">*</span>
            </label>
            <textarea
              name="observaciones"
              value={formData.observaciones}
              onChange={handleChange}
              rows={3}
              className="mt-1 w-full input-tailwind"
              required
              disabled={isSaving}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSaving}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader className="w-5 h-5 mr-2 spinner inline" />
                  Guardando...
                </>
              ) : (
                "Guardar"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ---------------------------------------
// COMPONENTE PRINCIPAL
const SectionTurnos: React.FC = () => {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [clientes, setClientes] = useState<ClienteSimple[]>([]);
  const [mascotas, setMascotas] = useState<MascotaSimple[]>([]);

  const [loading, setLoading] = useState(true);

  const [notification, setNotification] = useState<{
    message: string;
    type: "error" | "success";
  } | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<Turno | null>(null);

  // Carga de datos
  const cargarDatos = async () => {
    setLoading(true);
    setNotification(null); // Clear previous errors
    try {
      // Usamos Promise.all para cargar todo a la vez
      const [turnosData, clientesData, mascotasData] = await Promise.all([
        fetchApi("/turno"),
        fetchApi("/cliente"),
        fetchApi("/mascotas"),
      ]);

      setClientes(clientesData as ClienteSimple[]);
      setMascotas(mascotasData as MascotaSimple[]);
      setTurnos(turnosData as Turno[]);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setNotification({
        message: `Error al cargar datos: ${(err as Error).message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  useEffect(() => {
    console.log("Mascotas recibidas:", mascotas);
  }, [mascotas]);

  // Combinar datos y Filtrado
  const turnosFiltrados = useMemo(() => {
    const turnosConCliente = turnos.map((turno) => {
      const cliente = clientes.find((c) => c.id === turno.cliente_id);
      return {
        ...turno,
        cliente: cliente || {
          id: turno.cliente_id,
          nombre: "Cliente Desconocido",
        },
      };
    });

    return turnosConCliente
      .filter((t) => {
        const clienteNombre = t.cliente?.nombre.toLowerCase() ?? "";
        const clienteId = t.cliente_id?.toString() ?? "";

        // Incluimos búsqueda por Mascota
        const mascota = mascotas.find((m) => m.id_mascota === t.mascota_id);
        const mascotaNombre = mascota?.nombre.toLowerCase() ?? "";

        const searchMatch =
          clienteNombre.includes(searchTerm.toLowerCase()) ||
          mascotaNombre.includes(searchTerm.toLowerCase()) ||
          clienteId.includes(searchTerm) ||
          t.id_turno?.toString().includes(searchTerm);

        const tipoMatch = !filtroTipo || t.tipo === filtroTipo;
        const estadoMatch = !filtroEstado || t.estado === filtroEstado;

        return searchMatch && tipoMatch && estadoMatch;
      })
      .sort(
        (a, b) =>
          new Date(b.fecha_turno).getTime() - new Date(a.fecha_turno).getTime(),
      );
  }, [turnos, clientes, mascotas, searchTerm, filtroTipo, filtroEstado]);

  // Modales
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

  // CRUD
  const handleSave = async (data: CreateTurnoDto) => {
    if (!data.mascota_id) {
      setNotification({
        message: "Debe seleccionar una mascota.",
        type: "error",
      });
      return;
    }

    const dataToSend = {
      fecha_turno: new Date(data.fecha_turno).toISOString(),
      tipo: data.tipo,
      estado: data.estado,
      observaciones: data.observaciones,
      mascota_id: Number(data.mascota_id),
    };

    try {
      if (itemParaEditar) {
        await fetchApi(`/turno/${itemParaEditar.id_turno}`, {
          method: "PATCH",
          body: JSON.stringify(dataToSend),
        });
        setNotification({
          message: `Turno ID ${itemParaEditar.id_turno} actualizado con éxito.`,
          type: "success",
        });
      } else {
        await fetchApi("/turno", {
          method: "POST",
          body: JSON.stringify(dataToSend),
        });
        setNotification({
          message: "Nuevo turno agregado con éxito.",
          type: "success",
        });
      }
      handleCloseModal();
      await cargarDatos();
    } catch (err) {
      console.error("Error al guardar:", err);
      setNotification({
        message: `Error al guardar: ${(err as Error).message}`,
        type: "error",
      });
      throw err;
    }
  };
  const handleDelete = (id: number) => {
    setDeleteConfirmId(id);
  };

  const confirmDelete = async () => {
    const id = deleteConfirmId;
    setDeleteConfirmId(null);
    if (!id) return;

    setLoading(true);
    try {
      await fetchApi(`/turno/${id}`, { method: "DELETE" });
      setNotification({
        message: `Turno ID ${id} eliminado con éxito.`,
        type: "success",
      });
      await cargarDatos(); // Recargar datos
    } catch (err) {
      console.error("Error al eliminar:", err);
      setNotification({
        message: `Error al eliminar: ${(err as Error).message}`,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // RENDER
  return (
    <div className="space-y-6 p-4 md:p-8">
      {/* Estilos CSS */}
      <style>{`
        .btn-primary {
          background-color: #8F108D;
          color: white;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s;
        }
        .btn-primary:hover:not(:disabled) {
          background-color: #A822A6;
        }
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
        .btn-secondary {
          background-color: #e5e7eb;
          color: #374151;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          transition: background-color 0.2s;
        }
        .btn-secondary:hover:not(:disabled) {
          background-color: #d1d5db;
        }
        .input-tailwind {
          padding: 8px 12px;
          border-width: 1px;
          border-color: #d1d5db;
          border-radius: 8px;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .input-tailwind:focus {
          border-color: #8F108D;
          box-shadow: 0 0 0 2px rgba(143, 16, 141, 0.2);
        }
        .label-tailwind {
          display: block;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 4px;
        }
        .th-cell {
          padding: 12px 16px;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 500;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .td-cell {
          padding: 16px;
          white-space: nowrap;
          font-size: 0.875rem;
          color: #6b7280;
        }
        .td-cell-main {
           padding: 16px;
           white-space: nowrap;
           font-size: 0.875rem;
           font-weight: 500;
           color: #1f2937;
        }
        .td-center {
           padding: 32px 16px;
           text-align: center;
           font-size: 0.875rem;
           color: #6b7280;
        }
        @keyframes spinner {
          to {transform: rotate(360deg);}
        }
        .spinner {
          animation: spinner 1s linear infinite;
        }
      `}</style>

      <h1 className="text-3xl font-bold text-[#8F108D]">Gestión de Turnos</h1>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        {/* Filtros y Botón Nuevo */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar por Cliente, ID o Mascota..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8F108D]"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button
              onClick={handleOpenModalNuevo}
              className="btn-primary flex items-center justify-center"
              disabled={loading || clientes.length === 0}
            >
              <Plus className="w-5 h-5 mr-2" />
              Nuevo Turno
            </button>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="label-tailwind mb-1">Tipo de Turno</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="input-tailwind w-full"
              >
                <option value="">Todos los Tipos</option>
                {OPCIONES_TIPO_TURNO.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="label-tailwind mb-1">Estado del Turno</label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="input-tailwind w-full"
              >
                <option value="">Todos los Estados</option>
                {OPCIONES_ESTADO_TURNO.map((e) => (
                  <option key={e} value={e}>
                    {e.charAt(0).toUpperCase() + e.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de Turnos */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="th-cell">ID Turno</th>
                <th className="th-cell">Fecha y Hora</th>
                <th className="th-cell">Cliente</th>
                <th className="th-cell">Tipo</th>
                <th className="th-cell">Observaciones</th>
                <th className="th-cell">Estado</th>
                <th className="th-cell text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="td-center">
                    <Loader className="w-6 h-6 inline mr-2 spinner text-[#8F108D]" />
                    Cargando turnos...
                  </td>
                </tr>
              ) : turnosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="td-center">
                    No se encontraron turnos.
                  </td>
                </tr>
              ) : (
                turnosFiltrados.map((item) => (
                  <tr key={item.id_turno} className="hover:bg-gray-50">
                    <td className="td-cell truncate max-w-[5rem]">
                      {item.id_turno}
                    </td>
                    <td className="td-cell-main">
                      {formatFechaDisplay(item.fecha_turno)}
                    </td>
                    <td className="td-cell">
                      {item.cliente?.nombre ?? "Cliente no disponible"}
                    </td>
                    <td className="td-cell">
                      {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                    </td>
                    <td
                      className="td-cell truncate max-w-xs"
                      data-tooltip-id="tooltip-main"
                      data-tooltip-content={item.observaciones}
                    >
                      {item.observaciones}
                    </td>
                    <td className="td-cell">
                      {item.estado.charAt(0).toUpperCase() +
                        item.estado.slice(1)}
                    </td>
                    <td className="td-cell text-right space-x-2">
                      <button
                        onClick={() => handleOpenModalEditar(item)}
                        className="text-[#8F108D] hover:text-[#A822A6] p-1 rounded-md hover:bg-gray-200"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Editar"
                      >
                        <Edit className="w-5 h-5 inline" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_turno)}
                        className="text-red-600 hover:text-red-800 p-1 rounded-md hover:bg-gray-200"
                        data-tooltip-id="tooltip-main"
                        data-tooltip-content="Eliminar"
                      >
                        <Trash2 className="w-5 h-5 inline" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmación para eliminar */}
      {deleteConfirmId !== null && (
        <CustomConfirmModal
          title="Confirmar Eliminación"
          message={`¿Está seguro que desea eliminar el turno ID ${deleteConfirmId}? Esta acción es irreversible.`}
          onConfirm={confirmDelete}
          onCancel={() => setDeleteConfirmId(null)}
        />
      )}

      {/* Modal principal de Turnos */}
      {isModalOpen && (
        <TurnoModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
          initialData={itemParaEditar}
          clientes={clientes}
          mascotas={mascotas}
        />
      )}

      {/* Notificaciones (Error/Éxito) */}
      {notification && (
        <NotificationMessage
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Tooltip id="tooltip-main" className="react-tooltip" />
    </div>
  );
};
export default SectionTurnos;
