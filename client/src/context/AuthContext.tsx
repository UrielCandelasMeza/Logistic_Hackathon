import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import axios from "../api/axios";
import { AxiosError } from "axios";

// Tipos
interface User {
  id: string;
  email: string;
  rol: string;
}

export interface AuthContextType {
  user: User | null;
  isAuth: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Función para decodificar JWT
const decodeToken = (token: string): User | null => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const decoded = JSON.parse(jsonPayload);

    return {
      id: decoded.userId || decoded.id || decoded.sub,
      email: decoded.email,
      rol: decoded.role || decoded.rol,
    };
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};

// Provider
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticación
  const checkAuth = async () => {
    try {
      const { data } = await axios.get("/verify");

      if (data.accessToken) {
        const userData = decodeToken(data.accessToken);
        if (userData) {
          setUser(userData);
          setIsAuth(true);
        }
      } else if (data.user) {
        // Si el backend ya envía los datos decodificados
        setUser(data.user);
        setIsAuth(true);
      }
    } catch (error) {
      console.error("Error al verificar autenticación:", error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Login
  const login = async (email: string, password: string) => {
    try {
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      console.log("Respuesta de login:", data.user);

      // El backend ya estableció las cookies, ahora verificamos la sesión
      await checkAuth();
    } catch (error) {
      console.error("Error en login:", error);
      if (error instanceof AxiosError) {
        throw new Error(
          error.response?.data?.message || "Error al iniciar sesión"
        );
      }
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axios.post("/logout");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setUser(null);
      setIsAuth(false);
    }
  };

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth();
  }, []);

  const value: AuthContextType = {
    user,
    isAuth,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
