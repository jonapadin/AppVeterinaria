/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { FaCheckCircle } from "react-icons/fa";

// ASUME que tienes una implementación de fetchApi en esta ruta:
import { fetchApi } from "../../app/api";


// CONFIGURACIÓN DE API Y UTILS 

const API_TURNO_BASE_URL = "/turno"; // Base: /api/v1/turno
const API_MASCOTA_BASE_URL = "/mascotas"; // Base: /api/v1/mascotas
const API_CLIENTE_BASE_URL = "/cliente"; // Base: /api/v1/cliente
const API_USER_BASE_URL = "/usuarios"; // Base: /api/v1/usuario
interface UserData {
  email: string;
  id: number; // User ID
  isAdmin: boolean;
  role: string;
  // Asumimos que el backend anida el ID del cliente o el objeto cliente aquí
  cliente?: { id: number } | number;
  token: string;
}

// Interfaz para la respuesta completa del Cliente
interface Cliente {
  id: number;
  nombre: string;
  apellido: string;
  mascotas: Mascota[]; // Asumimos que la respuesta del cliente incluye sus mascotas
  // ... otros campos del cliente
}

const getClientFromLocalStorage = (): {
  userId: number | null;
  token: string | null;
} => {
  const clientData = localStorage.getItem("user_data");
  if (clientData) {
    try {
      const user: UserData = JSON.parse(clientData);
      // devolvemos el ID del Usuario (user.id)
      return {
        userId: user.id,
        token: user.token || "fake_token",
      };
    } catch (e) {
      console.error("Error parsing user data from localStorage:", e);
      return { userId: null, token: null };
    }
  } // Valor simulado para pruebas
  return { userId: 4, token: "fake_token" };
};

const IS_USER_LOGGED_IN = !!getClientFromLocalStorage().token;

// --- DEFINICIONES DE TIPOS (Mantenidas) ---
export type PetType = "Perro" | "Gato" | "Ave" | "Otro";
export type AppointmentReason =
  | "Consulta General"
  | "Chequeo Médico"
  | "Vacunación"
  | "Castración";
const reasons: AppointmentReason[] = [
  "Consulta General",
  "Chequeo Médico",
  "Vacunación",
  "Castración",
];

export interface Mascota {
  id: number;
  nombre: string;
  especie: PetType;
  cliente_id: number;
}

export interface Appointment {
  id: string; // id_turno del backend
  mascota_id: number;
  petName: string;
  petType: PetType;
  reason: AppointmentReason;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  estado: string;
}

export interface FormState {
  petName: string; // Contiene el Mascota ID como string
  reason: AppointmentReason;
  date: string;
  time: string;
}

interface TurnoDto {
  mascota_id: number;
  fecha_turno: string;
  observaciones: string;
  tipo: string;
}

// Función auxiliar para parsear el motivo de las observaciones
const parseReason = (observaciones: string): AppointmentReason => {
  const reasonMatch = observaciones.match(/Motivo:\s*(.*)/);
  const reason = reasonMatch ? reasonMatch[1].trim() : "Consulta General";
  if (reasons.includes(reason as AppointmentReason)) {
    return reason as AppointmentReason;
  }
  return "Consulta General";
};

// --- COMPONENTES SECUNDARIOS: AppointmentCard y BookingForm (SIN CAMBIOS FUNCIONALES) ---


interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
  onEdit: (appointment: Appointment) => void;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({
  appointment,
  onCancel,
  onEdit,
}) => {
  const statusClasses = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDIENTE":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETADO":
        return "bg-green-100 text-green-800";
      case "CANCELADO":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isCancellable = appointment.estado.toUpperCase() === "PENDIENTE";

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {appointment.petName}
          </h3>
          <p className="text-sm text-gray-500">{appointment.petType}</p>
        </div>

        <div className="text-right">
          <span
            className={`inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full ${statusClasses(
              appointment.estado
            )}`}
          >
            {appointment.estado.toUpperCase()}
          </span>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {appointment.time}
          </p>
        </div>
      </div>

      <div className="mt-4 text-gray-700">
        <p>
          <span className="font-medium">Motivo:</span> {appointment.reason}
        </p>
        <p>
          <span className="font-medium">Fecha:</span> {appointment.date}
        </p>
      </div>

      <div className="flex justify-end space-x-3 mt-4">
        {isCancellable && (
          <button
            onClick={() => onEdit(appointment)}
            className="px-3 py-1 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition duration-150"
          >
            Modificar
          </button>
        )}

        {isCancellable && (
          <button
            onClick={() => onCancel(appointment.id)}
            className="px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition duration-150"
          >
            Cancelar
          </button>
        )}
      </div>
    </div>
  );
};

interface BookingFormProps {
  onSubmit: (formData: FormState) => void;
  availablePets: Mascota[];
  initialData?: FormState;
}

const BookingForm: React.FC<BookingFormProps> = ({
  onSubmit,
  availablePets,
  initialData,
}) => {
  const defaultPetId =
    availablePets.length > 0 ? availablePets[0].id.toString() : "";
  const [formData, setFormData] = useState<FormState>({
    petName: initialData?.petName || defaultPetId,
    reason: initialData?.reason || reasons[0],
    date: initialData?.date || new Date().toISOString().substring(0, 10),
    time: initialData?.time || "09:00",
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData((prev) => ({
        ...prev,
        petName: availablePets.length > 0 ? availablePets[0].id.toString() : "",
      }));
    }
  }, [initialData, availablePets]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.petName || !formData.date || !formData.time) {
      alert("Por favor, selecciona una mascota y completa la fecha/hora.");
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* CAMPO MASCOTA (SELECT) */}{" "}
      <div>
        {" "}
        <label
          htmlFor="petName"
          className="block text-sm font-medium text-gray-700"
        >
          Mascota{" "}
        </label>{" "}
        <select
          id="petName"
          name="petName"
          value={formData.petName}
          onChange={handleChange}
          required
          disabled={availablePets.length === 0}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
        >
          {" "}
          {availablePets.length === 0 ? (
            <option value="" disabled>
              No hay mascotas disponibles
            </option>
          ) : (
            availablePets.map((pet) => (
              <option key={pet.id} value={pet.id.toString()}>
                {pet.nombre} ({pet.especie}){" "}
              </option>
            ))
          )}{" "}
        </select>{" "}
      </div>
      {/* CAMPO MOTIVO (SELECT) */}{" "}
      <div>
        {" "}
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-gray-700"
        >
          Motivo del Turno{" "}
        </label>{" "}
        <select
          id="reason"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          required
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
        >
          {" "}
          {reasons.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}{" "}
        </select>{" "}
      </div>
      {/* CAMPO FECHA Y HORA */}{" "}
      <div className="grid grid-cols-2 gap-4">
        {" "}
        <div>
          {" "}
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Fecha{" "}
          </label>{" "}
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            min={new Date().toISOString().substring(0, 10)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />{" "}
        </div>{" "}
        <div>
          {" "}
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Hora{" "}
          </label>{" "}
          <input
            type="time"
            id="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />{" "}
        </div>{" "}
      </div>
      {/* BOTÓN DE SUBMIT */}{" "}
      <div>
        {" "}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {" "}
          {initialData ? "Actualizar Turno" : "Reservar Turno"}{" "}
        </button>{" "}
      </div>{" "}
    </form>
  );
};


// --- COMPONENTE PRINCIPAL (BookingPage) ---
// -----------------------------------------------------------------

const BookingPage: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [availablePets, setAvailablePets] = useState<Mascota[]>([]);
  const [editingAppointment, setEditingAppointment] =
    useState<Appointment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Obtenemos el ID del Usuario y el token.
  const { userId } = useMemo(() => getClientFromLocalStorage(), []);

  // Estado para el ID del Cliente, que se obtendrá por API
  const [finalClientId, setFinalClientId] = useState<number | null>(null); // Lógica de Mapeo para POST/PATCH (Depende de las Mascotas disponibles) ---

  const createAppointmentFromResponse = useCallback(
    (data: any): Appointment => {
      const petId = data.mascota?.id || data.mascota_id;
      const getPetNameAndType = (mascotaId: number) => {
        const pet = availablePets.find((p) => p.id === mascotaId);
        return {
          petName:
            pet?.nombre ||
            (petId ? "Mascota no disponible" : "Mascota Desconocida"),
          petType: pet?.especie || ("Otro" as PetType),
        };
      };

      const { petName, petType } = getPetNameAndType(petId);
      const fullDate = new Date(data.fecha_turno);

      return {
        id:
          data.id_turno?.toString() ||
          String(data.id) ||
          Math.random().toString(),
        mascota_id: petId,
        petName: petName,
        petType: petType,
        reason: parseReason(data.observaciones),
        date: fullDate.toISOString().substring(0, 10),
        time: fullDate.toTimeString().substring(0, 5),
        estado: data.estado || "PENDIENTE",
      };
    },
    [availablePets]
  );

  // --- CARGA DE DATOS: Usuario -> Cliente -> Mascotas -> Turnos ---
  const fetchUserClientAndAppointments = useCallback(
    async (currentUserId: number) => {
      setIsLoading(true);
      setError(null);
      try {
        //  Obtener Usuario para conseguir el ID del Cliente
        const userData: UserData = await fetchApi(
          `${API_USER_BASE_URL}/${currentUserId}`
        );
        let clientIdFromUser: number | undefined;

        if (typeof userData.cliente === "number") {
          clientIdFromUser = userData.cliente;
        } else if (
          typeof userData.cliente === "object" &&
          userData.cliente !== null
        ) {
          clientIdFromUser = userData.cliente.id;
        }

        if (!clientIdFromUser) {
          setError("El usuario no está asociado a una cuenta de Cliente.");
          setFinalClientId(null);
          setIsLoading(false);
          return;
        }

        setFinalClientId(clientIdFromUser); // Guardamos el ID del cliente

        //  Obtener Cliente (asumo que esta ruta devuelve el cliente con sus mascotas)
        const clientData: Cliente = await fetchApi(
          `${API_CLIENTE_BASE_URL}/${clientIdFromUser}`
        );
        const clientPets: Mascota[] = clientData.mascotas || [];

        if (clientPets.length === 0) {
          setAvailablePets([]);
          setAppointments([]);
          setIsLoading(false);
          return;
        }

        setAvailablePets(clientPets);

        //  Obtener Turnos para CADA Mascota (Múltiples llamadas)
        // Creamos un array de promesas para obtener los turnos de todas las mascotas
        const turnosPromises = clientPets.map((pet) =>
          fetchApi(`${API_TURNO_BASE_URL}/mascota/${pet.id}`)
            .then((response) => {
              // Aseguramos que la respuesta es un array (o lo convertimos si es un objeto único)
              const data = Array.isArray(response)
                ? response
                : response
                ? [response]
                : [];
              // Añadimos el ID de la mascota a cada turno si no viene
              return data.map((turno: any) => ({
                ...turno,
                mascota_id: pet.id,
              }));
            })
            .catch((err) => {
              console.warn(
                `Error al obtener turnos para la Mascota ID ${pet.id}:`,
                err
              );
              return []; // Devuelve un array vacío si falla
            })
        );

        // Esperamos a que todas las promesas se resuelvan
        const allTurnosArrays = await Promise.all(turnosPromises);
        const allTurnos = allTurnosArrays.flat(); // Aplanamos el array de arrays de turnos

        // 4. Mapeo final de turnos
        const mappedAppointments = allTurnos.map((app: any) => {
          const fullDate = new Date(app.fecha_turno);
          const pet = clientPets.find((p: Mascota) => p.id === app.mascota_id);

          return {
            id:
              app.id_turno?.toString() ||
              String(app.id) ||
              Math.random().toString(),
            mascota_id: app.mascota_id,
            petName: pet?.nombre || "Mascota no disponible",
            petType: pet?.especie || ("Otro" as PetType),
            reason: parseReason(app.observaciones),
            date: fullDate.toISOString().substring(0, 10),
            time: fullDate.toTimeString().substring(0, 5),
            estado: app.estado || "PENDIENTE",
          };
        });

        setAppointments(
          mappedAppointments.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(
          `Error al cargar los datos. Mensaje: ${(err as Error).message}`
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  //  useEffect: Llama a la función de carga principal
  useEffect(() => {
    if (userId) {
      fetchUserClientAndAppointments(userId);
    }
  }, [userId, fetchUserClientAndAppointments]); //  LÓGICA DE CREACIÓN Y EDICIÓN (POST/PATCH) ---

  const handleBookingSubmit = async (formData: FormState) => {
    if (!finalClientId) {
      alert("Error: No se pudo determinar el ID del cliente.");
      return;
    }

    const { petName, reason, date, time } = formData;
    const isEditing = !!editingAppointment;
    const mascotaId = parseInt(petName, 10);
    const fecha_turno_iso = `${date}T${time}:00.000Z`;

    const turnoPayload: TurnoDto = {
      mascota_id: mascotaId,
      fecha_turno: fecha_turno_iso,
      observaciones: `Motivo: ${reason}`,
      tipo: "consulta",
    };

    const method = isEditing ? "PATCH" : "POST";
    const url = isEditing
      ? `${API_TURNO_BASE_URL}/${editingAppointment.id}`
      : API_TURNO_BASE_URL;
    try {
      const data = await fetchApi(url, {
        method: method,
        body: JSON.stringify(turnoPayload),
      });

      const newAppointment = createAppointmentFromResponse(data);
      if (isEditing) {
        setAppointments((prev) =>
          prev.map((app) =>
            app.id === newAppointment.id ? newAppointment : app
          )
        );
        setEditingAppointment(null);
        alert("✅ Turno actualizado con éxito");
      } else {
        setAppointments((prev) =>
          [newAppointment, ...prev].sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          )
        );
        alert("✅ Turno reservado con éxito");
      }
    } catch (err) {
      console.error("Error de API:", err);
      alert(`❌ Falló la operación: ${(err as Error).message}`);
    }
  };

  const handleEdit = (appointment: Appointment) => {
    setEditingAppointment(appointment);
  };

  const handleCancel = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que quieres cancelar este turno?"))
      return;
    try {
      await fetchApi(`${API_TURNO_BASE_URL}/${id}/cancelar`, {
        method: "PATCH",
      });

      setAppointments((prev) =>
        prev.map((app) =>
          app.id === id ? { ...app, estado: "CANCELADO" } : app
        )
      );
      alert("✅ Turno cancelado con éxito");
    } catch (err) {
      console.error("Error al cancelar:", err);
      alert(`❌ Falló la cancelación: ${(err as Error).message}`);
    }
  };

  const initialFormData: FormState | undefined = useMemo(() => {
    if (editingAppointment) {
      return {
        petName: editingAppointment.mascota_id.toString(),
        reason: editingAppointment.reason,
        date: editingAppointment.date,
        time: editingAppointment.time,
      };
    }
    return undefined;
  }, [editingAppointment]); // --- Renderizado ---
  if (!IS_USER_LOGGED_IN || !userId) {
    return (
      <div className="min-h-screen bg-gray-100 p-10 text-center">
        {" "}
        <div className="bg-red-100 text-red-800 p-6 rounded-lg text-xl font-medium max-w-md mx-auto">
          ⚠️ Debes iniciar sesión como cliente para gestionar tus turnos.{" "}
        </div>{" "}
      </div>
    );
  }

  // Si el usuario existe pero no tiene cliente asociado
  if (
    !finalClientId &&
    !isLoading &&
    error?.includes("Cliente no encontrado")
  ) {
    return (
      <div className="min-h-screen bg-gray-100 p-10 text-center">
        <div className="bg-orange-100 text-orange-800 p-6 rounded-lg text-xl font-medium max-w-md mx-auto">
          Tu usuario no está asociado a una cuenta de **Cliente**. Por favor,
          contacta a soporte para completar tu perfil.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-xl text-blue-600">
        Cargando turnos y mascotas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 mt-14 md:p-10">
      {" "}
      <div className="max-w-7xl mx-auto">
        {" "}
        <h1 className="text-center text-xl lg:text-4xl font-extrabold text-[#8F108D] my-12">
          Reserva y Gestión de Turnos{" "}
        </h1>{" "}
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {" "}
            <p>
              <strong>Error de Carga:</strong> {error}
            </p>{" "}
          </div>
        )}{" "}
        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10">
          {/*  FORMULARIO --- */}{" "}
          <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl mb-8 lg:mb-0">
            {" "}
            <h2 className="text-2xl font-bold text-[#8F108D] mb-6">
              {" "}
              {editingAppointment
                ? "Modificar Turno"
                : "Solicitar Nuevo Turno"}{" "}
            </h2>{" "}
            {availablePets.length === 0 ? (
              <div className="bg-pink-100 text-gray-800 p-4 rounded-lg">
                No tienes mascotas registradas. Por favor, registra una mascota
                primero para solicitar un turno.{" "}
              </div>
            ) : (
              <BookingForm
                onSubmit={handleBookingSubmit}
                availablePets={availablePets}
                initialData={initialFormData}
              />
            )}{" "}
            {editingAppointment && (
              <button
                onClick={() => setEditingAppointment(null)}
                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
              >
                Cancelar Edición y Crear Nuevo Turno{" "}
              </button>
            )}{" "}
          </div>
          {/* --- TURNOS RESERVADOS --- */}{" "}
          <aside className="lg:col-span-2">
            {" "}
            <div>
              {" "}
              <h2 className="text-3xl font-bold text-[#8F108D] mb-6 flex items-center gap-3">
                {" "}
                <FaCheckCircle className="text-[#8F108D]" />
                Tus Próximos Turnos{" "}
              </h2>{" "}
              {appointments.length > 0 ? (
                <div className="space-y-6">
                  {" "}
                  {appointments.map((app) => (
                    <AppointmentCard
                      key={app.id}
                      appointment={app}
                      onCancel={handleCancel}
                      onEdit={handleEdit}
                    />
                  ))}{" "}
                </div>
              ) : (
                <div className="bg-pink-100 text-gray-800 p-4 rounded-lg">
                  No tienes turnos pendientes.{" "}
                </div>
              )}{" "}
            </div>{" "}
          </aside>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

export default BookingPage;