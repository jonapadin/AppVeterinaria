
import type { RouteObject } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Home from "../pages/public/Home";
import Categoria from "../pages/public/Categoria";
import Login from "../pages/public/Login";
import Register from "../pages/public/Register";
import ResetPassPage from "../pages/public/ResetPassPage";
import ServicePage from "../pages/public/ServicePage";
import ProductDogPage from "../pages/public/ProductDogPage";
import ProductBirdsPage from "../pages/public/ProductBirdsPage";
import ProductExoticPage from "../pages/public/ProductExotic";
import ProductCatPage from "../pages/public/ProductCatPage";
import { Unauthorized } from "../pages/public/Unauthorized";
import { NotFound } from "../pages/public/NotFound";

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
        path: "productosPerro",
        element: <ProductDogPage />,
      },
      {
        path: "productosGato",
        element: <ProductCatPage />,
      },
       { path: "productosAves",
         element: <ProductBirdsPage /> },  
      { path: "productosExoticos",
         element: <ProductExoticPage /> },
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
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];
