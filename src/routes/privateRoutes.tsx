import type { RouteObject } from "react-router-dom";
import AdminPanel from "../pages/private/AdminPanel";
import User from "../pages/private/User";
import PrivateRoute from "../guards/privateGuard";

export const privateRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: <PrivateRoute allowedRoles={["admin"]} />,
    children: [
      {
        index: true,
        element: <AdminPanel />,
      },
    ],
  },
  {
    path: "/user",
    element: <PrivateRoute allowedRoles={["cliente"]} />,
    children: [
      {
        index: true,
        element: <User />,
      },
    ],
  },
];
