import { Link } from "react-router-dom";
import { CalendarCheck, Mail, MapPin, Phone } from "lucide-react";
import { useBusinessSettings } from "../hooks/useBusinessSettings";

function Footer() {
  const { settings } = useBusinessSettings();

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-2xl bg-blue-700 p-2 text-white">
              <CalendarCheck size={22} />
            </div>

            <span className="text-xl font-black">{settings.businessName}</span>
          </div>

          <p className="max-w-sm leading-7 text-slate-300">
            {settings.tagline}
          </p>
        </div>

        <div>
          <h3 className="mb-4 font-black">Quick Links</h3>

          <div className="grid gap-3 text-slate-300">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            <Link to="/services" className="hover:text-white">
              Services
            </Link>
            <Link to="/book" className="hover:text-white">
              Book Appointment
            </Link>
            <Link to="/portal" className="hover:text-white">
              Client Portal
            </Link>
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-black">Contact</h3>

          <div className="space-y-3 text-slate-300">
            <p className="flex items-center gap-3">
              <Phone size={18} />
              {settings.phone}
            </p>

            <p className="flex items-center gap-3">
              <Mail size={18} />
              {settings.email}
            </p>

            <p className="flex items-center gap-3">
              <MapPin size={18} />
              {settings.address}
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 px-6 py-4 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} {settings.businessName}. All rights
        reserved.
      </div>
    </footer>
  );
}

export default Footer;
