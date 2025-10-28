interface Props {
  seccionActiva: string;
  setSeccionActiva: (s: string) => void;
}

export default function Sidebar({ seccionActiva, setSeccionActiva }: Props) {
  const links = [
    { id: "usuarios", label: "Usuarios", icon: "👥" },
    { id: "mascotas", label: "Mascotas", icon: "🐾" },
    { id: "turnos", label: "Turnos", icon: "📅" },
    { id: "chat", label: "Chat", icon: "💬" },
    { id: "ventas", label: "Ventas", icon: "🛒" },
  ];

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("usuarioAutenticado");
    window.location.href = "/login";
  };

  return (
    <aside className="w-60 bg-white shadow-lg flex flex-col">
      <h2 className="text-center py-4 font-semibold text-lg text-blue-600 border-b">Panel Admin</h2>
      <nav className="flex-1 flex flex-col">
        {links.map(link => (
          <button
            key={link.id}
            onClick={() => setSeccionActiva(link.id)}
            className={`flex items-center gap-2 px-4 py-2 text-left transition-all 
              ${seccionActiva === link.id ? "bg-blue-500 text-white" : "hover:bg-gray-100"}`}
          >
            <span>{link.icon}</span> {link.label}
          </button>
        ))}
      </nav>
      <button
        onClick={cerrarSesion}
        className="mt-auto bg-red-500 hover:bg-red-600 text-white py-2"
      >
        Cerrar sesión
      </button>
    </aside>
  );
}