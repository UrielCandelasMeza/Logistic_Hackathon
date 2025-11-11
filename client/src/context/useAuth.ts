import { useContext } from "react";
import AuthContext from "./AuthContext";
import type { AuthContextType } from "./AuthContext";

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

export default useAuth;
