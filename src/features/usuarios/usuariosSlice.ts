/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";

export interface Usuario {
  id: string;
  nombre?: string;
  apellido?: string;
  fecha_nacimiento?: Date;
  dni?: number;
  telefono?: string;
  ciudad?: string;
  direccion?: string;
  email: string;
  rol: "user" | "empleado";
  fechaRegistro?: Date;
  estado?: string;
  foto_perfil?: string;
}

interface UsuariosState {
  lista: Usuario[];
  loading: boolean;
  error?: string | null;
}

const initialState: UsuariosState = {
  lista: [],
  loading: false,
  error: null,
};

// FETCH combinando usuario + cliente/empleado
export const fetchUsuarios = createAsyncThunk<Usuario[]>(
  "usuarios/fetchAll",
  async () => {
    const resUsuarios = await fetch("http://localhost:3000/api/v1/usuario");
    const usuarios = await resUsuarios.json();

    const usuariosCompletos = await Promise.all(
      usuarios.map(async (u: any) => {
        let extra: any = {};

        try {
          if (u.rol === "user") {
            const resCliente = await fetch(`http://localhost:3000/api/v1/cliente/${u.id}`);
            if (resCliente.ok) extra = await resCliente.json();
          } else if (u.rol === "empleado") {
            const resEmpleado = await fetch(`http://localhost:3000/api/v1/empleado/${u.id}`);
            if (resEmpleado.ok) extra = await resEmpleado.json();
          }
        } catch (err) {
          console.warn(`No se encontró info extra para usuario ${u.id}`, err);
        }

        return {
          ...u,
          ...extra,
          fecha_nacimiento: extra.fecha_nacimiento ? new Date(extra.fecha_nacimiento) : undefined,
          fechaRegistro: u.fechaRegistro ? new Date(u.fechaRegistro) : undefined,
        };
      })
    );

    return usuariosCompletos;
  }
);

// CRUD
export const addUsuario = createAsyncThunk("usuarios/add", async (usuario: Omit<Usuario, "id">) => {
  const res = await fetch("http://localhost:3000/api/v1/usuario", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  const data = await res.json();
  return { ...usuario, id: data.id };
});

export const updateUsuario = createAsyncThunk("usuarios/update", async (usuario: Usuario) => {
  await fetch(`http://localhost:3000/api/v1/usuario/${usuario.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });
  return usuario;
});

export const deleteUsuario = createAsyncThunk("usuarios/delete", async (id: string) => {
  await fetch(`http://localhost:3000/api/v1/usuario/${id}`, { method: "DELETE" });
  return id;
});

const usuariosSlice = createSlice({
  name: "usuarios",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsuarios.pending, state => { state.loading = true; })
      .addCase(fetchUsuarios.fulfilled, (state, action: PayloadAction<Usuario[]>) => {
        state.lista = action.payload;
        state.loading = false;
      })
      .addCase(fetchUsuarios.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error al cargar usuarios";
      })
      .addCase(addUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        state.lista.push(action.payload);
      })
      .addCase(updateUsuario.fulfilled, (state, action: PayloadAction<Usuario>) => {
        const index = state.lista.findIndex(u => u.id === action.payload.id);
        if (index !== -1) state.lista[index] = action.payload;
      })
      .addCase(deleteUsuario.fulfilled, (state, action: PayloadAction<string>) => {
        state.lista = state.lista.filter(u => u.id !== action.payload);
      });
  },
});

export default usuariosSlice.reducer;