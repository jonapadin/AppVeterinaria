/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { Usuario } from "./usuariosSlice";

export const fetchUsuarios = createAsyncThunk<Usuario[]>(
  "usuarios/fetchAll",
  async () => {
    const resUsuarios = await fetch("http://localhost:3000/api/v1/usuario");
    const usuarios = await resUsuarios.json();

    // Para cada usuario, traemos los datos extra según su rol
    const usuariosCompletos = await Promise.all(
      usuarios.map(async (u: any) => {
        let extra = {};
        if (u.rol === "user") {
          const resCliente = await fetch(`http://localhost:3000/api/v1/cliente/${u.id}`);
          extra = await resCliente.json();
        } else if (u.rol === "empleado") {
          const resEmpleado = await fetch(`http://localhost:3000/api/v1/empleado/${u.id}`);
          extra = await resEmpleado.json();
        }
        return { ...u, ...extra };
      })
    );

    return usuariosCompletos;
  }
);