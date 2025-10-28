import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchUsuarios, addUsuario, deleteUsuario, updateUsuario } from "../../features/usuarios/usuariosSlice";
import type { Usuario } from "../../features/usuarios/usuariosSlice";

export default function SectionUsuarios() {
  const dispatch = useDispatch<AppDispatch>();
  const { lista, loading, error } = useSelector((state: RootState) => state.usuarios);

  // Formularios
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [dni, setDni] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [direccion, setDireccion] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<"user" | "empleado">("user");
  const [editando, setEditando] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchUsuarios());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !rol) return;

    const usuarioData: Omit<Usuario, "id"> = {
      nombre,
      apellido,
      fecha_nacimiento: fechaNacimiento ? new Date(fechaNacimiento) : undefined,
      dni: dni ? Number(dni) : undefined,
      telefono,
      ciudad,
      direccion,
      email,
      rol,
      estado: "activo",
    };

    if (editando) {
      dispatch(updateUsuario({ id: editando, ...usuarioData }));
      setEditando(null);
    } else {
      dispatch(addUsuario(usuarioData));
    }

    // Limpiar formulario
    setNombre(""); setApellido(""); setFechaNacimiento(""); setDni("");
    setTelefono(""); setCiudad(""); setDireccion(""); setEmail(""); setRol("user");
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Usuarios</h2>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 mb-6">
        <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" className="border p-2 rounded w-1/5"/>
        <input value={apellido} onChange={e => setApellido(e.target.value)} placeholder="Apellido" className="border p-2 rounded w-1/5"/>
        <input type="date" value={fechaNacimiento} onChange={e => setFechaNacimiento(e.target.value)} placeholder="Fecha Nacimiento" className="border p-2 rounded w-1/5"/>
        <input value={dni} onChange={e => setDni(e.target.value)} placeholder="DNI" className="border p-2 rounded w-1/5"/>
        <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Teléfono" className="border p-2 rounded w-1/5"/>
        <input value={ciudad} onChange={e => setCiudad(e.target.value)} placeholder="Ciudad" className="border p-2 rounded w-1/5"/>
        <input value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Dirección" className="border p-2 rounded w-1/5"/>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="border p-2 rounded w-1/5"/>
        <select value={rol} onChange={e => setRol(e.target.value as "user" | "empleado")} className="border p-2 rounded w-1/5">
          <option value="user">Cliente</option>
          <option value="empleado">Empleado</option>
        </select>

        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          {editando ? "Actualizar" : "Agregar"}
        </button>
      </form>

      {loading && <p>Cargando usuarios...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <table className="w-full bg-white rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Nombre</th>
            <th className="p-2 text-left">Apellido</th>
            <th className="p-2 text-left">Fecha Nacimiento</th>
            <th className="p-2 text-left">DNI</th>
            <th className="p-2 text-left">Teléfono</th>
            <th className="p-2 text-left">Ciudad</th>
            <th className="p-2 text-left">Dirección</th>
            <th className="p-2 text-left">Email</th>
            <th className="p-2 text-left">Rol</th>
            <th className="p-2 text-left">Fecha Registro</th>
            <th className="p-2 text-left">Estado</th>
            <th className="p-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {lista.map(u => (
            <tr key={u.id}>
              <td className="p-2">{u.nombre}</td>
              <td className="p-2">{u.apellido}</td>
              <td className="p-2">{u.fecha_nacimiento?.toLocaleDateString()}</td>
              <td className="p-2">{u.dni}</td>
              <td className="p-2">{u.telefono}</td>
              <td className="p-2">{u.ciudad}</td>
              <td className="p-2">{u.direccion}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.rol}</td>
              <td className="p-2">{u.fechaRegistro?.toLocaleDateString()}</td>
              <td className="p-2">{u.estado}</td>
              <td className="p-2 text-right">
                <button onClick={() => {
                  setNombre(u.nombre ?? ""); setApellido(u.apellido ?? "");
                  setFechaNacimiento(u.fecha_nacimiento?.toISOString().split("T")[0] ?? "");
                  setDni(u.dni?.toString() ?? "");
                  setTelefono(u.telefono ?? ""); setCiudad(u.ciudad ?? "");
                  setDireccion(u.direccion ?? ""); setEmail(u.email);
                  setRol(u.rol); setEditando(u.id);
                }} className="text-blue-500 hover:text-blue-700 mr-2">✏️</button>
                <button onClick={() => dispatch(deleteUsuario(u.id))} className="text-red-500 hover:text-red-700">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}