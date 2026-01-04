import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import Sidebar from "@/components/layout/Sidebar";
import { DashboardPage } from "@/pages/DashboardPage";
import { AppointmentsPage } from "@/pages/AppointmentsPage"; // Ahora coincidirá con el 'export function'
import { PatientsPage } from "@/pages/PatientsPage";
import { CashFlowPage } from "@/pages/CashFlowPage";
import { SettingsPage } from "@/pages/SettingsPage";
import EvolutionsPage from "@/pages/EvolutionsPage";
import PatientDetailRoute from "@/pages/PatientDetailRoute";
import ReportsPage from "@/pages/ReportsPage";
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
          <Route path="/patients/:id" element={<PatientDetailRoute />} />
          <Route path="/cashflow" element={<CashFlowPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/evolutions" element={<EvolutionsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FeaturesProvider>
          <KarehLayout />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </FeaturesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}