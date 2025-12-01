import { useEffect } from "react";
import { io } from "socket.io-client";

// Define la interfaz de notificación (la puedes importar si está en otro archivo)
type Notificacion = {
  id_notificaciones: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  // Agrega cualquier otro campo que venga del backend
};

const SOCKET_URL = "http://localhost:3000"; // ⚠️ Ajusta tu URL

/**
 * Hook para conectar WebSocket y escuchar nuevas notificaciones.
 * @param userId ID del usuario actual para que el Gateway sepa a dónde enviar.
 * @param token Token de autenticación para asegurar la conexión.
 * @param setNotificaciones Función de estado para actualizar la lista.
 */
export const useNotificaciones = (
  userId: string | number,
  token: string,
  setNotificaciones: React.Dispatch<React.SetStateAction<Notificacion[]>>,
) => {
  useEffect(() => {
    if (!userId || !token) return;

    // Conectar al Gateway, enviando las credenciales para la autenticación
    const socket = io(SOCKET_URL, {
      query: { userId: String(userId), token },
      transports: ["websocket"],
    });

    // 👂 Escucha el evento 'notificacion' (enviado por tu backend)
    socket.on("notificacion", (nuevaNotificacion: Notificacion) => {
      console.log("Notificación en tiempo real recibida:", nuevaNotificacion);

      // 1. Mostrar una alerta visual (Toast/Alerta)
      // Aquí puedes integrar una librería de toasts
      alert(`🔔 ${nuevaNotificacion.titulo}`);

      // 2. Insertar la nueva notificación al inicio de la lista
      setNotificaciones((prev) => [nuevaNotificacion, ...prev]);
    });

    socket.on("connect", () => {
      console.log("Cliente WebSocket conectado para usuario:", userId);
    });

    // Función de limpieza: Cierra la conexión al desmontar el componente
    return () => {
      socket.disconnect();
    };
  }, [userId, token, setNotificaciones]);
};
