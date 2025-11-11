import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

import MainLayout from "./layouts/MainLayout";
import ManagerLayout from "./layouts/ManagerLayout";
import SalesLayout from "./layouts/SalesLayout";
import StorageLayout from "./layouts/StorageLayout";
import QualityLayout from "./layouts/QualityLayout";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Support from "./pages/Support";

import ProtectedRoutes from "./auth/ProtectedRoutes";

import HomeManager from "./pages/Manager/HomeManager";
import HomeSales from "./pages/Sales/HomeSales";
import HomeQuality from "./pages/Quality/HomeQuality";
import HomeStorage from "./pages/Storage/HomeStorage";

import { AuthProvider } from "./context/AuthContext";

function App() {
  const theme = createTheme({
    fontFamily: "Inter, sans-serif",
    primaryColor: "blue",
  });
  return (
    <MantineProvider theme={theme}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/support" element={<Support />} />
            </Route>
            <Route element={<ProtectedRoutes />}>
              <Route path=""></Route>

              <Route path="/home/manager/*" element={<ManagerLayout />}>
                <Route path="" element={<HomeManager />} />
              </Route>
              <Route path="/home/sales/*" element={<SalesLayout />}>
                <Route path="" element={<HomeSales />} />
              </Route>
              <Route path="/home/quality/*" element={<QualityLayout />}>
                <Route path="" element={<HomeQuality />} />
              </Route>
              <Route path="/home/storage/*" element={<StorageLayout />}>
                <Route path="" element={<HomeStorage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
