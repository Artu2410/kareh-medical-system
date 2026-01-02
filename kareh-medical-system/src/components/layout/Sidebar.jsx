import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  DollarSign,
} from "lucide-react";

const navItemClass = ({ isActive }) =>
  `
  flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium
  transition-colors
  ${
    isActive
      ? "bg-teal-100 text-teal-700"
      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
  }
`;

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-xl font-bold text-teal-700">
          KAREH Pro
        </h1>
        <p className="text-xs text-slate-500">
          Sistema Médico
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1">
        <NavLink to="/dashboard" className={navItemClass}>
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink to="/appointments" className={navItemClass}>
          <Calendar size={18} />
          Agenda
        </NavLink>

        <NavLink to="/patients" className={navItemClass}>
          <Users size={18} />
          Pacientes
        </NavLink>

        <NavLink to="/cashflow" className={navItemClass}>
          <DollarSign size={18} />
          Caja Chica
        </NavLink>

        <NavLink to="/settings" className={navItemClass}>
          <Settings size={18} />
          Configuración
        </NavLink>
      </nav>
    </aside>
  );
}
