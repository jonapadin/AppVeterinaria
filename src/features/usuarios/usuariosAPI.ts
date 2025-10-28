import axios from "axios";
import type { Usuario } from "./usuariosSlice";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: { "Content-Type": "application/json" },
});

// ✅ GET todos los usuarios
export const obtenerUsuariosAPI = async (): Promise<Usuario[]> => {
  const res = await api.get<Usuario[]>("/usuario");
  return res.data;
};

// ✅ POST crear usuario
export const crearUsuarioAPI = async (
  usuario: Omit<Usuario, "id">,
): Promise<Usuario> => {
  const res = await api.post<Usuario>("/usuario", usuario);
  return res.data;
};

// ✅ PUT actualizar usuario
export const actualizarUsuarioAPI = async (
  usuario: Usuario,
): Promise<Usuario> => {
  const res = await api.put<Usuario>(`/usuario/${usuario.id}`, usuario);
  return res.data;
};

// ✅ DELETE usuario
export const eliminarUsuarioAPI = async (id: string): Promise<string> => {
  await api.delete(`/usuario/${id}`);
  return id;
};

// ✅ POST login (nuevo)
export const loginAPI = async (email: string, password: string) => {
  const res = await api.post("/auth/login", { email, password });
  return res.data; // { access_token, user }
};

