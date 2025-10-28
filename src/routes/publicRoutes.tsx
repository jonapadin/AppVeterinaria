// src/routes/publicRoutes.ts
import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/public/Home";
import Categoria from "../pages/public/Categoria";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ResetPassPage from "../pages/public/ResetPassPage";
import ServicePage from "../pages/public/ServicePage";

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
        element: <Login />,
      },
      {
        path: "products",
        element: <Categoria />,
      },
      {
        path: "services",

        element: <ServicePage />,
      },
      {
        path: "register",

        element: <Register />,
      },
      {
        path: "recover-pass",

        element: <ResetPassPage />,
      },
    ],
  },
];
