// src/routes/publicRoutes.ts
import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/public/Home";

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,

    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        lazy: async () => {
          const { default: Login } = await import("../pages/public/Login");
          return {
            element: <Login />,
          };
        },
      },
      {
        path: "products",
        lazy: async () => {
          const { default: Categoria } = await import(
            "../pages/public/Categoria"
          );
          return {
            element: <Categoria />,
          };
        },
      },
      {
        path: "services",
        lazy: async () => {
          const { default: Service } = await import("../pages/public/Service");
          return {
            element: <Service />,
          };
        },
      },
      {
        path: "register",
        lazy: async () => {
          const { default: Register } = await import(
            "../pages/public/Register"
          );
          return {
            element: <Register />,
          };
        },
      },
      {
        path: "recover-pass",
        lazy: async () => {
          const { default: ResetPassPage } = await import(
            "../pages/public/ResetPassPage"
          );
          return {
            element: <ResetPassPage />,
          };
        },
      },
      // Puedes agregar aquí una ruta 404 (Not Found)
      /*
      {
        path: "*",
        lazy: async () => {
          const { default: NotFound } = await import("../pages/public/NotFound");
          return { element: <NotFound /> };
        },
      },
      */
    ],
  },
];
