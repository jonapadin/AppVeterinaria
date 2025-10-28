import axios from "axios";
import type { Usuario } from "./usuariosSlice";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1", // coincide con tu backend
});

// GET todos los usuarios
export const obtenerUsuariosAPI = async (): Promise<Usuario[]> => {
  const res = await api.get<Usuario[]>("/usuario"); // endpoint singular
  return res.data; // devuelve un array de usuarios
};

// POST crear usuario
export const crearUsuarioAPI = async (usuario: Omit<Usuario, "id">): Promise<Usuario> => {
  const res = await api.post<Usuario>("/usuario", usuario); // endpoint singular
  return res.data;
};

// PUT actualizar usuario
export const actualizarUsuarioAPI = async (usuario: Usuario): Promise<Usuario> => {
  const res = await api.put<Usuario>(`/usuario/${usuario.id}`, usuario); // endpoint singular
  return res.data;
};

// DELETE usuario
export const eliminarUsuarioAPI = async (id: string): Promise<string> => {
  await api.delete(`/usuario/${id}`); // endpoint singular
  return id;
};