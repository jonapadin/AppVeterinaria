import { useEffect, useState } from "react";

//
// 👉 1. TIPO DE NOTIFICACIÓN
//
type Notificacion = {
  id_notificaciones: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
};

//
// 👉 2. SERVICIOS
//

// Obtener todas las notificaciones
const obtenerNotificaciones = async (): Promise<Notificacion[]> => {
  const resp = await fetch(
    "https://apiv1-vet.onrender.com/api/v1/notificaciones",
  );

  if (!resp.ok) {
    throw new Error("Error obteniendo notificaciones");
  }

  return resp.json();
};

// Marcar notificación como leída
const marcarNotificacionLeida = async (id: number): Promise<void> => {
  const resp = await fetch(
    `http://localhost:3000/api/v1/notificaciones/${id}/leida`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );

  if (!resp.ok) {
    throw new Error("Error marcando como leída");
  }
};

//
// 👉 3. COMPONENTE PRINCIPAL
//

function SectionNotifacationes() {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [cargando, setCargando] = useState(true);

  // Cargar notificaciones al abrir la pantalla
  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await obtenerNotificaciones();
        setNotificaciones(data);
      } catch (error) {
        console.error("Error cargando notificaciones:", error);
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  // Marcar como leída + actualizar estado
  const handleMarcarLeida = async (id: number) => {
    try {
      await marcarNotificacionLeida(id);

      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id_notificaciones === id ? { ...n, leida: true } : n,
        ),
      );
    } catch (error) {
      console.error("Error marcando leída:", error);
    }
  };

  //
  // 👉 UI
  //
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notificaciones</h2>

      {cargando && <p className="text-gray-500">Cargando...</p>}

      {!cargando && notificaciones.length === 0 && (
        <p className="text-gray-500">No hay notificaciones</p>
      )}

      <ul className="space-y-3">
        {notificaciones.map((n) => (
          <li
            key={n.id_notificaciones}
            className={`p-3 rounded-lg border ${
              n.leida ? "bg-gray-100 opacity-60" : "bg-white"
            }`}
          >
            <div className="font-semibold">{n.titulo}</div>
            <div className="text-sm">{n.mensaje}</div>

            {!n.leida && (
              <button
                className="mt-2 px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                onClick={() => handleMarcarLeida(n.id_notificaciones)}
              >
                Marcar como leída
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SectionNotifacationes;
