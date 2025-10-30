import React, { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

// Importa los dos componentes
import BookingForm, { type FormState } from '../Forms/BookingForm';
import AppointmentCard from '../Forms/AppointmentCard';

// --- Definiciones de Tipos (Puedes moverlas a src/types/index.ts) ---
export type PetType = 'Perro' | 'Gato' | 'Ave' | 'Otro';
export type AppointmentReason = 'Consulta General' | 'Chequeo Médico' | 'Vacunación' | 'Castración';

export interface Appointment {
  id: string;
  petName: string;
  petType: PetType;
  reason: AppointmentReason;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
}
// -----------------------------------------------------------------

// --- SIMULACIÓN DE DATOS (Esto vendría de Redux Toolkit) ---
const IS_USER_LOGGED_IN = true; // Simula que el usuario está loggeado

const MOCKED_APPOINTMENTS: Appointment[] = [
  { id: '1', petName: 'Rocky', petType: 'Perro', reason: 'Vacunación', date: '2025-11-20', time: '10:00' },
  { id: '2', petName: 'Misha', petType: 'Gato', reason: 'Chequeo Médico', date: '2025-11-22', time: '15:30' },
];
// -----------------------------------------------------------

const BookingPage: React.FC = () => {
  
  // Este estado manejaría la lista de turnos (vendría de Redux)
  const [appointments, setAppointments] = useState(MOCKED_APPOINTMENTS);

  // Lógica para manejar el submit del formulario
  const handleBookingSubmit = (formData: FormState) => {
    console.log('NUEVO TURNO (enviar a Redux):', formData);
    
    // Simulación: Añade el nuevo turno a la lista
    const newAppointment: Appointment = {
      id: (Math.random() * 1000).toString(),
      ...formData,
    } as Appointment; // Aseguramos el tipo
    
    setAppointments(prev => [newAppointment, ...prev]);
    alert('Turno reservado con éxito');
  };

  // Lógica para cancelar un turno
  const handleCancel = (id: string) => {
    console.log('CANCELAR TURNO (enviar a Redux):', id);
    setAppointments(prev => prev.filter(app => app.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          Reserva de Turnos
        </h1>

        {/* LAYOUT RESPONSIVO: 
          - 1 columna en móvil.
          - 2 columnas en pantallas grandes (lg).
        */}
        <div className="grid grid-cols-1 lg:grid-cols-5 lg:gap-10">

          {/* --- COLUMNA 1: FORMULARIO (ocupa 3 de 5 columnas en lg) --- */}
          <div className="lg:col-span-3 bg-white p-8 rounded-2xl shadow-xl mb-8 lg:mb-0">
            <BookingForm onSubmit={handleBookingSubmit} />
          </div>

          {/* --- COLUMNA 2: TURNOS RESERVADOS (ocupa 2 de 5 columnas en lg) --- */}
          <aside className="lg:col-span-2">
            {!IS_USER_LOGGED_IN ? (
              <div className="bg-blue-100 text-blue-800 p-6 rounded-lg text-center font-medium">
                Inicia sesión para ver tus próximos turnos.
              </div>
            ) : (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                  <FaCheckCircle className="text-blue-600" />
                  Tus Próximos Turnos
                </h2>
                {appointments.length > 0 ? (
                  <div className="space-y-6">
                    {appointments.map(app => (
                      <AppointmentCard
                        key={app.id}
                        appointment={app}
                        onCancel={handleCancel}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-md text-center text-gray-500">
                    No tienes turnos pendientes.
                  </div>
                )}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;