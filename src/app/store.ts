import { configureStore } from "@reduxjs/toolkit";
import usuariosReducer from "../features/usuarios/usuariosSlice";

export const store = configureStore({
  reducer: {
    usuarios: usuariosReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;