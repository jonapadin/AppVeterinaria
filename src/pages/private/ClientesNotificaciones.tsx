import { useEffect, useState } from "react";
import { useNotificaciones } from "../../hooks/useNotificaciones";

interface ClienteNotificacionesProps {
  currentUserId: number;
  authToken: string;
}

type Notificacion = {
  id_notificaciones: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  // Añade las propiedades que sean necesarias
};

interface ClienteNotificacionesProps {
  currentUserId: number;
  authToken: string;
}

const obtenerNotificacionesCliente = async (
  token: string,
): Promise<Notificacion[]> => {
  const resp = await fetch(
    "https://apiv1-vet.onrender.com/api/v1/notificaciones/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!resp.ok) {
    throw new Error("Error obteniendo notificaciones");
  }

  return resp.json();
};

export default function ClienteNotificaciones({
  currentUserId,
  authToken,
}: ClienteNotificacionesProps) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  // ⚡ 1. Conexión WebSocket para tiempo real
  useNotificaciones(currentUserId, authToken, setNotificaciones);

  // 2. Cargar notificaciones iniciales (REST)
  useEffect(() => {
    const cargar = async () => {
      if (!authToken) return;
      try {
        const data = await obtenerNotificacionesCliente(authToken);
        setNotificaciones(data);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, [authToken]);

  const notificacionesNoLeidas = notificaciones.filter((n) => !n.leida).length;

  return (
    <div className="p-4">
      {/* 🔔 Ícono de Notificación */}
      <div className="relative inline-block">
        <button className="p-2 rounded-full bg-gray-200 hover:bg-gray-300">
          <span role="img" aria-label="Notificaciones">
            🔔
          </span>
        </button>
        {notificacionesNoLeidas > 0 && (
          <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            {notificacionesNoLeidas}
          </span>
        )}
      </div>

      {/* Lista de Notificaciones (Opcional: puedes poner esto en un modal) */}
      <h2 className="text-xl font-bold mt-4 mb-4">Mis Notificaciones</h2>
      {/* ... (Tu UI de lista existente) ... */}
    </div>
  );
}
