import React, { useState, useMemo } from 'react';
import { FaDog, FaCat, FaKiwiBird, FaPaw } from 'react-icons/fa';
import { PetType, AppointmentReason } from '../pages/BookingPage'; // Importa tipos

// --- Definiciones locales del componente ---
export interface FormState {
  petName: string;
  petType: PetType | null;
  reason: AppointmentReason | null;
  date: string;
  time: string | null;
}

const PET_OPTIONS: { name: PetType; icon: React.ElementType }[] = [
  { name: 'Perro', icon: FaDog },
  { name: 'Gato', icon: FaCat },
  { name: 'Ave', icon: FaKiwiBird },
  { name: 'Otro', icon: FaPaw },
];

const REASON_OPTIONS: AppointmentReason[] = [
  'Consulta General', 'Chequeo Médico', 'Vacunación', 'Castración',
];

// --- Lógica de Horarios (8:00 a 17:00) ---
const generateTimeSlots = (startHour: number, endHour: number, intervalMinutes: number): string[] => {
  const slots: string[] = [];
  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min = 0; min < 60; min += intervalMinutes) {
      if (hour === endHour && min > 0) break; // No pasar de las 17:00
      
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
      if (hour === endHour && time > `${endHour}:00`) continue; // Asegura no pasar la hora final
      
      // Lógica para solo agregar horarios laborales
      if(hour === 17 && min > 0) continue; // No más allá de 17:00
      if(hour < startHour) continue; // No antes de las 8:00
      
      slots.push(time);
    }
  }
  // Filtro final para asegurar 17:00 exacta si el intervalo es 60
  if (!slots.includes("17:00") && intervalMinutes === 60) slots.push("17:00");
  
  // En este ejemplo, simplificamos con intervalos de 60 min para claridad
  const simplifiedSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'
  ];
  
  // Simulación de horarios ocupados (vendría de Redux/API)
  const occupiedSlots = ['10:00', '14:00']; 
  
  return simplifiedSlots.filter(slot => !occupiedSlots.includes(slot));
};
// ----------------------------------------------------

interface Props {
  onSubmit: (formData: FormState) => void;
}

const BookingForm: React.FC<Props> = ({ onSubmit }) => {
  
  const [formState, setFormState] = useState<FormState>({
    petName: '',
    petType: null,
    reason: null,
    date: '',
    time: null,
  });

  // Genera los horarios disponibles
  const availableSlots = useMemo(() => {
    // La generación de slots dependería de la fecha (formState.date)
    // pero para este ejemplo, son fijos.
    return generateTimeSlots(8, 17, 60); 
  }, [formState.date]); // Se recalcula si cambia la fecha

  const handleFieldChange = (field: keyof FormState, value: any) => {
    // Si cambia la fecha, resetea la hora
    if (field === 'date') {
      setFormState(prev => ({ ...prev, date: value, time: null }));
    } else {
      setFormState(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formState);
    // Resetear formulario
    setFormState({ petName: '', petType: null, reason: null, date: '', time: null });
  };

  const isFormValid = Object.values(formState).every(value => value !== null && value !== '');

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      
      {/* SECCIÓN 1: MASCOTA */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">¿Para quién es?</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PET_OPTIONS.map((pet) => {
            const isSelected = formState.petType === pet.name;
            return (
              <button
                type="button"
                key={pet.name}
                onClick={() => handleFieldChange('petType', pet.name)}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all ${
                  isSelected ? 'border-blue-500 bg-blue-50 scale-105 shadow-md' : 'border-gray-200 bg-white hover:border-gray-400'
                }`}
              >
                <pet.icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-blue-600' : 'text-gray-500'}`} />
                <span className={`font-medium ${isSelected ? 'text-blue-700' : 'text-gray-700'}`}>{pet.name}</span>
              </button>
            );
          })}
        </div>
        <input
          type="text"
          placeholder="Nombre de tu mascota"
          value={formState.petName}
          onChange={(e) => handleFieldChange('petName', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mt-4 focus:ring-2 focus:ring-blue-500"
        />
      </section>
      
      {/* SECCIÓN 2: MOTIVO */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">¿Cuál es la consulta?</h2>
        <div className="grid grid-cols-2 gap-4">
          {REASON_OPTIONS.map((reason) => (
            <button
              type="button"
              key={reason}
              onClick={() => handleFieldChange('reason', reason)}
              className={`p-4 rounded-lg text-left transition-all border-2 ${
                formState.reason === reason ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-200 bg-white hover:border-gray-400'
              }`}
            >
              {reason}
            </button>
          ))}
        </div>
      </section>

      {/* SECCIÓN 3: FECHA Y HORA */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">¿Para cuándo?</h2>
        <input
          type="date"
          value={formState.date}
          min={new Date().toISOString().split('T')[0]} // Mínimo hoy
          onChange={(e) => handleFieldChange('date', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {/* NOTA: El <input type="date"> nativo no deshabilita feriados/sábados.
          Para eso, necesitarías 'react-datepicker' y pasarle la lógica de deshabilitación.
        */}
        
        {/* Selector de Hora (Innovador) */}
        {formState.date && (
          <div className="mt-5">
            <h3 className="text-md font-semibold text-gray-700 mb-3">Horarios disponibles (8:00 - 17:00)</h3>
            <div className="flex flex-wrap gap-3">
              {availableSlots.length > 0 ? availableSlots.map(time => (
                <button
                  type="button"
                  key={time}
                  onClick={() => handleFieldChange('time', time)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    formState.time === time ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              )) : (
                <p className="text-gray-500">No hay horarios disponibles para esta fecha.</p>
              )}
            </div>
          </div>
        )}
      </section>

      {/* BOTÓN DE RESERVA */}
      <button
        type="submit"
        disabled={!isFormValid}
        className="w-full p-4 bg-blue-600 text-white text-lg font-bold rounded-xl shadow-lg
                   hover:bg-blue-700 transition-all
                   disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Reservar Turno
      </button>
    </form>
  );
};

export default BookingForm;