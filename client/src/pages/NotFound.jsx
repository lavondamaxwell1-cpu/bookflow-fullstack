import { Link } from "react-router-dom";
import { AlertTriangle, Home, CalendarCheck } from "lucide-react";
import PageShell from "../components/PageShell";

function NotFound() {
  return (
    <PageShell
      title="Page Not Found"
      subtitle="The page you are looking for does not exist."
    >
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-100 text-yellow-700">
          <AlertTriangle size={32} />
        </div>

        <h2 className="text-3xl font-black text-slate-950">
          Oops, this page is missing.
        </h2>

        <p className="mx-auto mt-3 max-w-md leading-7 text-slate-600">
          The link may be wrong, or the page may have been moved. You can go
          back home or book an appointment.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            <Home size={18} />
            Go Home
          </Link>

          <Link
            to="/book"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-100"
          >
            <CalendarCheck size={18} />
            Book Appointment
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

export default NotFound;
