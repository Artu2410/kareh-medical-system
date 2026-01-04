import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Se agregó BrowserRouter
import Sidebar from "@/components/layout/Sidebar";
import { DashboardPage } from "@/pages/DashboardPage";
import { AppointmentsPage } from "@/pages/AppointmentsPage";
import { PatientsPage } from "@/pages/PatientsPage";
import { CashFlowPage } from "@/pages/CashFlowPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { AuthProvider } from "@/context/AuthContext";
import { FeaturesProvider } from "@/context/FeaturesContext";

function KarehLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/cashflow" element={<CashFlowPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Ruta opcional para capturar errores 404 */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter> {/* <--- Este es el envoltorio vital */}
      <AuthProvider>
        <FeaturesProvider>
          <KarehLayout />
        </FeaturesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}