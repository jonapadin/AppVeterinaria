
import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/public/Home";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ResetPassPage from "../pages/public/ResetPassPage";
import ServicePage from "../pages/public/ServicePage";
import ProductDogPage from "../pages/public/ProductDogPage";
import ProductBirdsPage from "../pages/public/ProductBirdsPage";
import ProductCatPage from "../pages/public/ProductCatPage";
import { Unauthorized } from "../pages/public/Unauthorized";
import { NotFound } from "../pages/public/NotFound";
import FormRecoveryPass from "../components/login/FormRecoveryPass";
import Categorias from "../components/categoria/Categorias";
import ProductExoticPage from "../pages/public/ProductExotic";

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
        path: "categoria",
        element: <Categorias />,
        children: [
          {
            path: "productosPerro",
            element: <ProductDogPage />,
          },
          {
            path: "productosGato",
            element: <ProductCatPage />,
          },
          {
            path: "productosAves",
            element: <ProductBirdsPage />
          },
          {
            path: "productosExoticos",
            element: <ProductExoticPage />
          },
        ]
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
      {
        path: "reset-pass",

        element: <FormRecoveryPass />,
      }
    ],
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
