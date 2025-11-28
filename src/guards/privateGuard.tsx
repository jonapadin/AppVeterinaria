import { Navigate, Outlet } from "react-router-dom";

// 1. Definir la interfaz User (debe coincidir con la de authSlice)
interface User {
  email: string;
  role: "empleado" | "cliente";
  isAdmin: boolean; // 👈 AÑADIDO: Propiedad crucial para la autorización de Admin Especial
}

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute = ({ allowedRoles }: PrivateRouteProps) => {
  const token = localStorage.getItem("token");

  // 2. Parsear el usuario con el tipo correcto (User)
  const user = JSON.parse(
    localStorage.getItem("user") || "null",
  ) as User | null;

  // VERIFICACIÓN 1: Autenticación (¿Hay Token y Usuario?)
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // VERIFICACIÓN 2: Autorización (¿Tiene el Rol/Permiso Necesario?)
  if (allowedRoles) {
    let hasAccess = false;

    // Lógica para verificar si el usuario tiene acceso
    if (allowedRoles.includes("admin") && user.isAdmin) {
      // 3. Si se requiere 'admin', comprobamos la bandera isAdmin
      hasAccess = true;
    } else if (allowedRoles.includes(user.role)) {
      // Si el rol requerido es un rol estándar (ej. 'cliente', 'empleado'), comprobamos el role
      hasAccess = true;
    }

    if (!hasAccess) {
      // 4. Si el acceso es denegado, redirigir
      return user.role === "cliente" ? (
        <Navigate to="/" replace />
      ) : (
        <Navigate to="/unauthorized" replace />
      );
    }
  }

  // Si pasa todas las verificaciones
  return <Outlet />;
};

export default PrivateRoute;
