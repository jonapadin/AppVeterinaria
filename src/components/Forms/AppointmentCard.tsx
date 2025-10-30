import React from 'react';
import { FaDog, FaCat, FaKiwiBird, FaPaw, FaCalendar, FaClock, FaTag, FaTimes } from 'react-icons/fa';

// Tipos locales para evitar la importación faltante
type PetType = 'Perro' | 'Gato' | 'Ave' | 'Otro';

interface Appointment {
  id: string;
  petName: string;
  petType: PetType;
  date: string; // ISO date string
  time: string; // e.g. "14:30"
  reason: string;
}

// Mapeo de íconos
const petIconMap: Record<PetType, React.ElementType> = {
  Perro: FaDog,
  Gato: FaCat,
  Ave: FaKiwiBird,
  Otro: FaPaw,
};

interface Props {
  appointment: Appointment;
  onCancel: (id: string) => void;
  // onModify?: (id: string) => void; // Opcional
}

const AppointmentCard: React.FC<Props> = ({ appointment, onCancel }) => {
  const Icon = petIconMap[appointment.petType] || FaPaw;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      {/* Borde de color distintivo */}
      <div className="border-l-8 border-blue-500 p-5">
        
        {/* Encabezado: Mascota y Botón Cancelar */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-2xl font-bold text-gray-800">{appointment.petName}</h3>
              <span className="text-sm font-medium text-gray-500">{appointment.petType}</span>
            </div>
          </div>
          <button 
            onClick={() => onCancel(appointment.id)}
            title="Cancelar Turno"
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Detalles: Fecha, Hora y Motivo */}
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-3 text-gray-700">
            <FaCalendar className="text-gray-400" />
            <span className="font-medium">{new Date(appointment.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaClock className="text-gray-400" />
            <span className="font-medium">{appointment.time} hs</span>
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <FaTag className="text-gray-400" />
            <span className="font-medium">{appointment.reason}</span>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default AppointmentCard;