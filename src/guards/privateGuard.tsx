import { Navigate, Outlet } from "react-router-dom";

//  Definir la interfaz User (debe coincidir con la de authSlice)
interface User {
  email: string;
  role: "empleado" | "cliente";
  isAdmin: boolean; //Propiedad crucial para la autorización de Admin Especial
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

  // VERIFICACIÓN de Autenticación Token y Usuario
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // VERI Autorización si el Rol/Permiso Necesario
  if (allowedRoles) {
    let hasAccess = false;

    // Lógica para verificar si el usuario tiene acceso
    if (allowedRoles.includes("admin") && user.isAdmin) {
      // Si se requiere 'admin', comprobamos la bandera isAdmin
      hasAccess = true;
    } else if (allowedRoles.includes(user.role)) {
      // Si el rol requerido es un rol estándar (ej. 'cliente', 'empleado'), comprobamos el role
      hasAccess = true;
    }

    if (!hasAccess) {
      //  Si el acceso es denegado, redirigir
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
