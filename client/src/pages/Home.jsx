import { Link } from "react-router-dom";
import {
  Clock,
  Users,
  LayoutDashboard,
  Phone,
  Mail,
  MapPin,
} from "lucide-react";
import { useBusinessSettings } from "../hooks/useBusinessSettings";

function FeatureCard({ icon, title, text }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
      <div className="mb-4 inline-flex rounded-2xl bg-blue-100 p-3 text-blue-700">
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-black text-slate-900">{title}</h3>
      <p className="leading-7 text-slate-600">{text}</p>
    </div>
  );
}

function ContactCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <div className="mb-2 text-blue-700">{icon}</div>
      <p className="text-sm font-bold text-slate-400">{label}</p>
      <p className="font-bold text-slate-800">{value}</p>
    </div>
  );
}

function Home() {
  const { settings } = useBusinessSettings();

  return (
    <main>
      <section className="bg-gradient-to-br from-blue-50 via-white to-slate-100">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              Client Booking Portal
            </p>

            <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-6xl">
              Book with
              <span className="text-blue-700"> {settings.businessName}</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              {settings.tagline}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/book"
                className="rounded-2xl bg-blue-700 px-6 py-3 text-center font-bold text-white shadow-lg hover:bg-blue-800"
              >
                Book Appointment
              </Link>

              <Link
                to="/services"
                className="rounded-2xl border border-slate-300 bg-white px-6 py-3 text-center font-bold text-slate-800 hover:bg-slate-50"
              >
                View Services[]
              </Link>
            </div>
            <div className="mt-6 rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-black uppercase tracking-wide text-blue-700">
                Demo Access
              </p>

              <p className="mt-2 text-sm text-slate-600">
                Use this admin account to preview the dashboard, bookings,
                customers, services, and business settings.
              </p>

              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-bold text-slate-400">Email</p>
                  <p className="font-black text-slate-800">
                    admin@bookflow.com
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="font-bold text-slate-400">Password</p>
                  <p className="font-black text-slate-800">admin123</p>
                </div>
              </div>

              <Link
                to="/login"
                className="mt-4 inline-block rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-700"
              >
                Try Admin Demo
              </Link>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <ContactCard
                icon={<Phone size={20} />}
                label="Phone"
                value={settings.phone}
              />
              <ContactCard
                icon={<Mail size={20} />}
                label="Email"
                value={settings.email}
              />
              <ContactCard
                icon={<MapPin size={20} />}
                label="Address"
                value={settings.address}
              />
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Today’s Schedule
                </h2>
                <p className="text-sm text-slate-500">Appointment preview</p>
              </div>

              <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
                Open
              </span>
            </div>

            <div className="space-y-4">
              {[
                ["9:00 AM", "Starter Service", "Available"],
                ["11:30 AM", "Premium Service", "Popular"],
                ["1:00 PM", "VIP Service", "Premium"],
                ["3:30 PM", "Consultation", "Available"],
              ].map((item) => (
                <div
                  key={item[0]}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"
                >
                  <div>
                    <p className="font-bold text-slate-900">{item[1]}</p>
                    <p className="text-sm text-slate-500">{item[0]}</p>
                  </div>

                  <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-700">
                    {item[2]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          <FeatureCard
            icon={<Clock />}
            title="Easy Scheduling"
            text="Customers can choose a service, date, and time in minutes."
          />

          <FeatureCard
            icon={<Users />}
            title="Client Portal"
            text="Customers can view their appointments and cancel requests."
          />

          <FeatureCard
            icon={<LayoutDashboard />}
            title="Admin Dashboard"
            text="Business owners can approve bookings and manage services."
          />
        </div>
      </section>
    </main>
  );
}

export default Home;
