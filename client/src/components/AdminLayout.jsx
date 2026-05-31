import { NavLink, Outlet } from "react-router-dom";
import {
  BarChart3,
  CalendarCheck,
  Settings,
  SlidersHorizontal,
  Users,
} from "lucide-react";

function AdminLayout() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 rounded-2xl bg-blue-700 px-4 py-3 font-bold text-white"
      : "flex items-center gap-3 rounded-2xl px-4 py-3 font-bold text-slate-600 hover:bg-slate-100 hover:text-slate-900";

  return (
    <div className="min-h-screen bg-slate-50 lg:flex">
      <aside className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm lg:w-72 lg:border-b-0 lg:border-r lg:px-6 lg:py-8">
        <div className="mb-4 hidden lg:block">
          <p className="text-sm font-bold uppercase tracking-wide text-slate-400">
            Admin Panel
          </p>
          <h2 className="mt-1 text-2xl font-black text-slate-950">Dashboard</h2>
        </div>

        <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-1">
          <NavLink to="/admin" end className={linkClass}>
            <BarChart3 size={20} />
            <span>Overview</span>
          </NavLink>

          <NavLink to="/admin/bookings" className={linkClass}>
            <CalendarCheck size={20} />
            <span>Bookings</span>
          </NavLink>

          <NavLink to="/admin/services" className={linkClass}>
            <SlidersHorizontal size={20} />
            <span>Services</span>
          </NavLink>
          <NavLink to="/admin/customers" className={linkClass}>
            <Users size={20} />
            <span>Customers</span>
          </NavLink>
          <NavLink to="/admin/settings" className={linkClass}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
        </nav>
      </aside>

      <div className="min-w-0 flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
