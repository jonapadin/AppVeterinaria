import { useState } from "react";
import { FaBell, FaSyringe, FaCalendarAlt, FaFileMedical, FaPaw, FaTrashAlt, FaCheckCircle } from "react-icons/fa";

const initialNotifications = [
  { id: "1", mensaje: "¡Recordatorio! Tienes un turno mañana a las 10:00 AM.", tipo: "turno", leida: false },
  { id: "2", mensaje: "Nueva vacuna disponible para tu mascota.", tipo: "producto", leida: false },
  { id: "3", mensaje: "Tu historia clínica fue actualizada.", tipo: "historia", leida: true },
  { id: "4", mensaje: "Bienvenido a la app de la veterinaria 🐶🐱", tipo: "general", leida: true }
];

function Notificaciones() {
  const [notifications, setNotifications] = useState(initialNotifications);

  // Función para marcar como leída o no leída
  const toggleRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, leida: !n.leida } : n
    ));
  };

  // Función para eliminar una notificación
  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Función para obtener el número de notificaciones no leídas
  const unreadCount = notifications.filter((n) => !n.leida).length;

  // Función para obtener el ícono correspondiente al tipo de notificación
  const getIconByTipo = (tipo: string) => {
    switch (tipo) {
      case "turno":
        return <FaCalendarAlt className="text-blue-500 w-5 h-5" />;
      case "producto":
        return <FaSyringe className="text-green-500 w-5 h-5" />;
      case "historia":
        return <FaFileMedical className="text-purple-500 w-5 h-5" />;
      case "general":
        return <FaPaw className="text-pink-500 w-5 h-5" />;
      default:
        return <FaBell className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      {/* Título con contador de notificaciones no leídas */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 flex items-center gap-2">
        <FaBell className="text-yellow-500" />
        <span>Notificaciones</span>
        {unreadCount > 0 && (
          <span className="ml-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {unreadCount}
          </span>
        )}
      </h2>

      {/* Lista de notificaciones */}
      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`flex items-start gap-3 p-4 rounded-md border ${
              n.leida
                ? "bg-gray-100 border-gray-300 text-gray-500"
                : "bg-yellow-50 border-yellow-300 text-gray-800 font-medium"
            }`}
          >
            {/* Ícono de la notificación */}
            <div className="mt-1">{getIconByTipo(n.tipo)}</div>

            {/* Mensaje de la notificación */}
            <p className="flex-1">{n.mensaje}</p>

            {/* Botón de marcar/desmarcar como leída */}
            <button
              onClick={() => toggleRead(n.id)}
              className="text-gray-500 hover:text-gray-800 ml-2"
            >
              {n.leida ? (
                <FaCheckCircle className="text-green-500 w-5 h-5" />
              ) : (
                <FaCheckCircle className="text-gray-400 w-5 h-5" />
              )}
            </button>

            {/* Botón de eliminar */}
            <button
              onClick={() => deleteNotification(n.id)}
              className="text-red-500 hover:text-red-700 ml-2"
            >
              <FaTrashAlt className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Notificaciones;
