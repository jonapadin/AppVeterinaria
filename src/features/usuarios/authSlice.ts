import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  email: string;
  // 🛑 CORRECCIÓN 1: El rol del backend es 'empleado' o 'cliente'.
  // Ahora usaremos la bandera 'isAdmin' para la lógica de visualización.
  role: "empleado" | "cliente" | "user"; // Ajustar para reflejar los roles reales del backend (ej. 'empleado')
  isAdmin: boolean; // 👈 AÑADIDO: Propiedad crucial del backend.
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{ token: string; user: User }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    loadSession: (state) => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      if (token && user) {
        state.token = token;
        state.user = JSON.parse(user) as User;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { loginSuccess, logout, loadSession } = authSlice.actions;
export default authSlice.reducer;
