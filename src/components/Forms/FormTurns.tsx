/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

// 🚨 ASUME que tienes una implementación de fetchApi en esta ruta:
import { fetchApi } from '../../app/api'; 

// -----------------------------------------------------------------
// --- CONFIGURACIÓN DE API Y UTILS ---
// -----------------------------------------------------------------
const API_URL = '/turno';      // Base: /api/v1/turno
const API_MASCOTAS_URL = '/mascotas'; // Base: /api/v1/mascotas 

const getClientFromLocalStorage = () => {
    // Función para obtener el cliente logueado (simulada)
    const clientData = localStorage.getItem('user_data');
    if (clientData) {
        try {
            const user = JSON.parse(clientData);
            return { id: user.cliente?.id || null, token: user.token || 'fake_token' }; 
        } catch (e) {
            console.error("Error parsing user data from localStorage:", e);
            return { id: null, token: null };
        }
    }
    // Valor simulado para pruebas: Cliente con ID 1
    return { id: 1, token: 'fake_token' }; 
};
const IS_USER_LOGGED_IN = !!getClientFromLocalStorage().token;


// --- DEFINICIONES DE TIPOS ---
export type PetType = 'Perro' | 'Gato' | 'Ave' | 'Otro';
export type AppointmentReason = 'Consulta General' | 'Chequeo Médico' | 'Vacunación' | 'Castración';
const reasons: AppointmentReason[] = ['Consulta General', 'Chequeo Médico', 'Vacunación', 'Castración'];


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
    petName: string;      
    reason: AppointmentReason;
    date: string;
    time: string;
}

interface TurnoDto {
    mascota_id: number;
    fecha_turno: string; 
    observaciones: string;
}

// Función auxiliar para parsear el motivo de las observaciones
const parseReason = (observaciones: string): AppointmentReason => {
    const reasonMatch = observaciones.match(/Motivo:\s*(.*)/);
    const reason = reasonMatch ? reasonMatch[1].trim() : 'Consulta General';
    if (reasons.includes(reason as AppointmentReason)) {
        return reason as AppointmentReason;
    }
    return 'Consulta General';
}


// -----------------------------------------------------------------
// --- COMPONENTES SECUNDARIOS: AppointmentCard ---
// -----------------------------------------------------------------
interface AppointmentCardProps {
    appointment: Appointment;
    onCancel: (id: string) => void;
    onEdit: (appointment: Appointment) => void; 
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment, onCancel, onEdit }) => {
    
    const statusClasses = (status: string) => {
        switch (status?.toUpperCase()) {
            case 'PENDIENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'CONFIRMADO':
                return 'bg-green-100 text-green-800';
            case 'CANCELADO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const isCancellable = appointment.estado.toUpperCase() === 'PENDIENTE' || appointment.estado.toUpperCase() === 'CONFIRMADO';

    return (
        <div className="bg-white p-5 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{appointment.petName}</h3>
                    <p className="text-sm text-gray-500">{appointment.petType}</p>
                </div>
                
                <div className="text-right">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold leading-none rounded-full ${statusClasses(appointment.estado)}`}>
                        {appointment.estado}
                    </span>
                    <p className="text-2xl font-bold text-blue-600 mt-1">{appointment.time}</p>
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

// -----------------------------------------------------------------
// --- COMPONENTES SECUNDARIOS: BookingForm ---
// -----------------------------------------------------------------
interface BookingFormProps {
    onSubmit: (formData: FormState) => void;
    availablePets: Mascota[];       
    initialData?: FormState;        
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit, availablePets, initialData }) => {
    
    const defaultPetId = availablePets.length > 0 ? availablePets[0].id.toString() : '';
    
    const [formData, setFormData] = useState<FormState>({
        petName: initialData?.petName || defaultPetId,
        reason: initialData?.reason || reasons[0],
        date: initialData?.date || '',
        time: initialData?.time || '',
    });

    useEffect(() => {
        // Inicializa el formulario cuando cambian los datos iniciales o las mascotas disponibles
        if (initialData) {
            setFormData(initialData);
        } else {
            setFormData({
                petName: availablePets.length > 0 ? availablePets[0].id.toString() : defaultPetId,
                reason: reasons[0],
                date: '',
                time: '',
            });
        }
    }, [initialData, availablePets]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value as any }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.petName || !formData.date || !formData.time) {
            alert('Por favor, selecciona una mascota y completa la fecha/hora.');
            return;
        }

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* CAMPO MASCOTA (SELECT) */}
            <div>
                <label htmlFor="petName" className="block text-sm font-medium text-gray-700">
                    Mascota
                </label>
                <select
                    id="petName"
                    name="petName"
                    value={formData.petName}
                    onChange={handleChange}
                    required
                    disabled={availablePets.length === 0}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                >
                    {availablePets.length === 0 ? (
                         <option value="" disabled>Cargando mascotas...</option>
                    ) : (
                        availablePets.map(pet => (
                            <option key={pet.id} value={pet.id.toString()}>
                                {pet.nombre} ({pet.especie})
                            </option>
                        ))
                    )}
                </select>
            </div>

            {/* CAMPO MOTIVO (SELECT) */}
            <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                    Motivo del Turno
                </label>
                <select
                    id="reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                >
                    {reasons.map(r => (
                        <option key={r} value={r}>{r}</option>
                    ))}
                </select>
            </div>

            {/* CAMPO FECHA Y HORA */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                        Fecha
                    </label>
                    <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().substring(0, 10)} 
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                
                <div>
                    <label htmlFor="time" className="block text-sm font-medium text-gray-700">
                        Hora
                    </label>
                    <input
                        type="time"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            {/* BOTÓN DE SUBMIT */}
            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {initialData ? 'Actualizar Turno' : 'Reservar Turno'}
                </button>
            </div>
        </form>
    );
};


// -----------------------------------------------------------------
// --- COMPONENTE PRINCIPAL (BookingPage) ---
// -----------------------------------------------------------------

const BookingPage: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [availablePets, setAvailablePets] = useState<Mascota[]>([]);
    const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // clientData se inicializa una sola vez y no causa re-render innecesario
    const clientData = useMemo(() => getClientFromLocalStorage(), []);

    // --- CARGA DE DATOS INICIALES (Mascotas y Turnos) ---
    // 🚨 CORRECCIÓN CLAVE CONTRA EL BUCLE:
    // 1. fetchAllData ahora SOLO depende de clientData.id (valor estático o solo cambia al loguearse).
    // 2. Las funciones de mapeo que dependen de 'clientPets' se definen dentro de fetchAllData.
const fetchAllData = useCallback(async () => {
        if (!clientData.id) {
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
        
        try {
            // 1. Cargar Mascotas
            // ... (Lógica de carga de mascotas que se mantiene igual)
            const allPetsData: Mascota[] = await fetchApi(API_MASCOTAS_URL);
            const clientPets = allPetsData.filter(pet => pet.cliente_id === clientData.id);
            setAvailablePets(clientPets); 
            
            // 2. Cargar Turnos
let appointmentsData = await fetchApi(`${API_URL}/${clientData.id}`); 

// 🚨 WORKAROUND TEMPORAL: Convertir objeto único en array si es necesario.
if (appointmentsData && typeof appointmentsData === 'object' && !Array.isArray(appointmentsData)) {
    // Si la respuesta es un objeto (y no null), lo envolvemos en un array.
    appointmentsData = [appointmentsData]; 
    console.warn("Frontend Workaround: Convirtiendo objeto único a array para evitar TypeError.");
}

// 3. Mapeo y Verificación
let mappedAppointments: Appointment[] = [];

if (Array.isArray(appointmentsData)) {
    // Si es un array (ahora incluyendo el objeto envuelto), procedemos con el mapeo.
    // Definimos un mapper local que use `clientPets` (las mascotas filtradas para este cliente)
    const mapAppointment = (app: any): Appointment => {
        const petId = app.mascota?.id || app.mascota_id;
        const pet = clientPets.find((p: Mascota) => p.id === petId);
        const petName = pet?.nombre || 'Mascota Desconocida';
        const petType = (pet?.especie || 'Otro') as PetType;
        const fullDate = new Date(app.fecha_turno);

        return {
            id: app.id_turno?.toString() || String(app.id) || Math.random().toString(),
            mascota_id: petId,
            petName,
            petType,
            reason: parseReason(app.observaciones),
            date: fullDate.toISOString().substring(0, 10),
            time: fullDate.toTimeString().substring(0, 5),
            estado: app.estado || 'PENDIENTE',
        };
    };

    mappedAppointments = appointmentsData.map((app: any) => mapAppointment(app));
} else {
    // Si sigue sin ser un array (ej: null, o algún error inesperado), lo manejamos.
    console.error("API Error: La respuesta de turnos no es un array después del workaround.", appointmentsData);
}

setAppointments(mappedAppointments);
            
        } catch (err) {
            console.error('Error cargando datos:', err);
            setError(`Error al cargar los datos. Mensaje: ${(err as Error).message}`);
        } finally {
            setIsLoading(false);
        }
    }, [clientData.id]);

    // 4. useEffect: Llama a fetchAllData solo en el montaje y cuando clientData.id cambia.
    useEffect(() => {
        fetchAllData();
    }, [fetchAllData]); // Se mantiene la dependencia de fetchAllData, que solo cambia si clientData.id cambia.

    // --- Función de Mapeo para POST/PATCH ---
    // Esta función sí debe depender de 'availablePets' para mapear la respuesta del servidor.
    const createAppointmentFromResponse = useCallback((data: any): Appointment => {
        const petId = data.mascota?.id || data.mascota_id;
        
        const getPetNameAndType = (mascotaId: number) => {
            const pet = availablePets.find(p => p.id === mascotaId);
            return { 
                petName: pet?.nombre || 'Mascota Desconocida', 
                petType: pet?.especie || 'Otro' as PetType
            };
        };

        const { petName, petType } = getPetNameAndType(petId);
        const fullDate = new Date(data.fecha_turno);

        return {
            id: data.id_turno.toString(),
            mascota_id: petId,
            petName: petName,
            petType: petType,
            reason: parseReason(data.observaciones),
            date: fullDate.toISOString().substring(0, 10),
            time: fullDate.toTimeString().substring(0, 5),
            estado: data.estado,
        };
    }, [availablePets]); 


    // --- LÓGICA DE CREACIÓN Y EDICIÓN (POST/PATCH) ---
    const handleBookingSubmit = async (formData: FormState) => {
        const { petName, reason, date, time } = formData;
        
        const isEditing = !!editingAppointment;
        
        const mascotaId = parseInt(petName, 10); 
        const fecha_turno_iso = `${date}T${time}:00.000Z`;

        const turnoPayload: TurnoDto = {
            mascota_id: mascotaId,
            fecha_turno: fecha_turno_iso,
            observaciones: `Motivo: ${reason}`,
        };

        const method = isEditing ? 'PATCH' : 'POST';
        const url = isEditing ? `${API_URL}/${editingAppointment.id}` : API_URL;
        
        try {
            const data = await fetchApi(url, {
                method: method,
                body: JSON.stringify(turnoPayload),
            });

            const newAppointment = createAppointmentFromResponse(data); 
            
            if (isEditing) {
                setAppointments(prev => prev.map(app => 
                    app.id === newAppointment.id ? newAppointment : app
                ));
                setEditingAppointment(null); 
                alert('✅ Turno actualizado con éxito');
            } else {
                setAppointments(prev => [newAppointment, ...prev]);
                alert('✅ Turno reservado con éxito');
            }

        } catch (err) {
            console.error('Error de API:', err);
            alert(`❌ Falló la operación: ${(err as Error).message}`);
        }
    };

    const handleEdit = (appointment: Appointment) => {
        setEditingAppointment(appointment);
    };

    const handleCancel = async (id: string) => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar este turno?')) return;
        
        try {
            await fetchApi(`${API_URL}/${id}/cancelar`, {
                method: 'PATCH', 
            });

            setAppointments(prev => prev.map(app => 
                app.id === id ? { ...app, estado: 'CANCELADO' } : app
            ));
            alert('✅ Turno cancelado con éxito');
        } catch (err) {
            console.error('Error al cancelar:', err);
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
    }, [editingAppointment]);
    
    // --- Renderizado ---
    if (!IS_USER_LOGGED_IN || !clientData.id) {
        return (
            <div className="min-h-screen bg-gray-100 p-10 text-center">
                <div className="bg-red-100 text-red-800 p-6 rounded-lg text-xl font-medium max-w-md mx-auto">
                    ⚠️ Debes iniciar sesión como cliente para gestionar tus turnos.
                </div>
            </div>
        );
    }

    if (isLoading) {
        return <div className="p-10 text-center text-xl text-blue-600">Cargando turnos y mascotas...</div>;
    }


    return (
        <div className="min-h-screen bg-gray-100 mt-14 md:p-10">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-center text-xl lg:text-4xl font-extrabold text-[#8F108D] my-12">
                    Reserva y Gestión de Turnos
                </h1>
                
                {error && (
                    <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
                        <p><strong>Error de Carga:</strong> {error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10">

                    {/* --- COLUMNA 1: FORMULARIO --- */}
                    <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl mb-8 lg:mb-0">
                        <h2 className="text-2xl font-bold text-[#8F108D] mb-6">
                            {editingAppointment ? 'Modificar Turno' : 'Solicitar Nuevo Turno'}
                        </h2>
                        
                        {availablePets.length === 0 ? (
                            <div className="bg-pink-100 text-gray-800 p-4 rounded-lg">
                             No tienes mascotas registradas. Por favor, registra una mascota primero para solicitar un turno.
                            </div>
                        ) : (
                            <BookingForm 
                                onSubmit={handleBookingSubmit} 
                                availablePets={availablePets}
                                initialData={initialFormData}
                            />
                        )}
                        
                        {editingAppointment && (
                            <button 
                                onClick={() => setEditingAppointment(null)}
                                className="mt-4 text-sm text-gray-500 hover:text-gray-700"
                            >
                                Cancelar Edición y Crear Nuevo Turno
                            </button>
                        )}
                    </div>

                    {/* --- COLUMNA 2: TURNOS RESERVADOS --- */}
                    <aside className="lg:col-span-2">
                        <div>
                            <h2 className="text-3xl font-bold text-[#8F108D] mb-6 flex items-center gap-3">
                                <FaCheckCircle className="text-[#8F108D]" />
                                Tus Próximos Turnos
                            </h2>
                            {appointments.length > 0 ? (
                                <div className="space-y-6">
                                    {appointments.map(app => (
                                        <AppointmentCard
                                            key={app.id}
                                            appointment={app}
                                            onCancel={handleCancel}
                                            onEdit={handleEdit} 
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-pink-100 text-gray-800  p-4 rounded-lg">
                                   No tienes turnos pendientes.
                                </div>
                            )}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
};

export default BookingPage;