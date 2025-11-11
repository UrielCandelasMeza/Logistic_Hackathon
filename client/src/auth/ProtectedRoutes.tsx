import useAuth from "../context/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import { LoadingOverlay } from "@mantine/core";

function ProtectedRoutes() {
  const { user, isLoading, isAuth } = useAuth();
  const location = useLocation();

  // Mientras carga, mostrar overlay de carga
  if (isLoading) {
    return <LoadingOverlay visible={true} />;
  }

  // Si no está autenticado, redirigir a login guardando la ubicación actual
  if (!isAuth) {
    console.log("no auth");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si no hay usuario (caso edge)
  if (!user) {
    console.log("no user");
    return <Navigate to="/login" replace />;
  }

  // Mapeo de rutas por rol
  const roleRoutes: Record<string, string> = {
    ADMIN: "/home/admin",
    MANAGER: "/home/manager",
    VENDEDOR: "/home/sales",
    CALIDAD: "/home/quality",
    ALMACEN: "/home/storage",
    CAJERO: "/home/checkout",
  };

  const routeForRole = roleRoutes[user.rol];

  if (!routeForRole) {
    console.log(user.rol);
    return <Navigate to="/home" replace />;
  }

  if (location.pathname.startsWith(routeForRole)) {
    return <Outlet />;
  }

  // Redirigir a la ruta correspondiente de su rol
  return <Navigate to={routeForRole} replace />;
}

export default ProtectedRoutes;
