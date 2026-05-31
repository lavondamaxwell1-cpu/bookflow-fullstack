import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { CalendarCheck, Menu, X } from "lucide-react";
import { useBusinessSettings } from "../hooks/useBusinessSettings";
import { useAuth } from "../hooks/useAuth";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useBusinessSettings();
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-700 font-semibold"
      : "text-slate-600 hover:text-blue-700";

  const mobileLinkClass = ({ isActive }) =>
    isActive
      ? "block rounded-xl bg-blue-50 px-4 py-3 font-semibold text-blue-700"
      : "block rounded-xl px-4 py-3 font-semibold text-slate-700 hover:bg-slate-100";

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeMenu();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2">
          <div className="rounded-2xl bg-blue-700 p-2 text-white">
            <CalendarCheck size={22} />
          </div>

          <span className="text-xl font-black text-slate-900">
            {settings.businessName}
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>

          <NavLink to="/services" className={linkClass}>
            Services
          </NavLink>

          <NavLink to="/book" className={linkClass}>
            Book
          </NavLink>

          <NavLink to="/portal" className={linkClass}>
            Portal
          </NavLink>
          {isLoggedIn && (
            <NavLink to="/profile" className={linkClass}>
              Profile
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={linkClass}>
              Dashboard
            </NavLink>
          )}
        </nav>

        {/* Desktop Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          {isLoggedIn ? (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100"
            >
              Login
            </Link>
          )}

          <Link
            to="/book"
            className="rounded-xl bg-blue-700 px-4 py-2 font-semibold text-white shadow hover:bg-blue-800"
          >
            Book Now
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="rounded-xl border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <div className="border-t border-slate-200 bg-white px-6 py-4 shadow-lg md:hidden">
          <nav className="space-y-2">
            <NavLink to="/" onClick={closeMenu} className={mobileLinkClass}>
              Home
            </NavLink>

            <NavLink
              to="/services"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              Services
            </NavLink>

            <NavLink to="/book" onClick={closeMenu} className={mobileLinkClass}>
              Book
            </NavLink>

            <NavLink
              to="/portal"
              onClick={closeMenu}
              className={mobileLinkClass}
            >
              Portal
            </NavLink>
            {isLoggedIn && (
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Profile
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={closeMenu}
                className={mobileLinkClass}
              >
                Dashboard
              </NavLink>
            )}

            <div className="pt-3">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="block w-full rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="block rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-700 hover:bg-slate-100"
                >
                  Login
                </Link>
              )}

              <Link
                to="/book"
                onClick={closeMenu}
                className="mt-3 block rounded-xl bg-blue-700 px-4 py-3 text-center font-bold text-white shadow hover:bg-blue-800"
              >
                Book Now
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

export default Navbar;
