import type { RouteObject } from "react-router-dom";
import AdminPanel from "../pages/private/AdminPanel";
import User from "../pages/private/User";
import PrivateRoute from "../guards/privateGuard";
import Profile from "../pages/private/UserProfile";
import Turns from "../pages/private/Turns";
import MedicalRecord from "../pages/private/MedicalRecord";
import Notificaciones from "../pages/private/Notifications";

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
    element: <PrivateRoute allowedRoles={["user"]} />,
    children: [
      {
        index: true,
        element: <User />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "turns",
        element: <Turns />,
      },
      {
        path: "medical-record",
        element: <MedicalRecord />
      },
      {
        path: "notifications",
        element: <Notificaciones />,
      }
    ],
  },
];
