import { Link } from "react-router-dom";
import { CalendarCheck, Clock, DollarSign, ListChecks } from "lucide-react";
import PageShell from "../components/PageShell";
import StatCard from "../components/StatCard";
import { useBookings } from "../hooks/useBookings";
import { useServices } from "../hooks/useServices";

function AdminDashboard() {
  const { bookings } = useBookings();
  const { services } = useServices();

  const getServicePrice = (serviceName) => {
    const matchingService = services.find(
      (service) => service.name === serviceName,
    );

    return Number(matchingService?.price || 0);
  };

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) => booking.status === "Pending",
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === "Confirmed",
  ).length;

  const declinedBookings = bookings.filter(
    (booking) => booking.status === "Declined",
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => booking.status === "Cancelled",
  ).length;

  const estimatedRevenue = bookings
    .filter((booking) => booking.status === "Confirmed")
    .reduce((total, booking) => {
      return total + getServicePrice(booking.service);
    }, 0);

  const recentBookings = [...bookings]
    .filter((booking) => booking.status !== "Declined")
    .slice(0, 5);

  const getStatusClass = (status) => {
    if (status === "Confirmed") return "bg-green-100 text-green-700";
    if (status === "Declined") return "bg-red-100 text-red-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Cancelled") return "bg-slate-200 text-slate-700";

    return "bg-slate-100 text-slate-700";
  };

  return (
    <PageShell
      title="Admin Dashboard"
      subtitle="Track bookings, pending requests, and estimated revenue."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={totalBookings}
          note="All booking requests"
        />

        <StatCard
          label="Pending"
          value={pendingBookings}
          note="Needs approval"
        />

        <StatCard
          label="Confirmed"
          value={confirmedBookings}
          note="Approved appointments"
        />

        <StatCard
          label="Revenue"
          value={`$${estimatedRevenue.toLocaleString()}`}
          note="Confirmed bookings only"
        />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:p-6 md:flex-row md:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Recent Bookings
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Latest appointment requests from customers.
              </p>
            </div>

            <Link
              to="/admin/bookings"
              className="rounded-xl bg-blue-700 px-4 py-2 text-center text-sm font-bold text-white hover:bg-blue-800"
            >
              View All
            </Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="font-bold text-slate-700">No bookings yet.</p>
              <p className="mt-1 text-sm text-slate-500">
                New booking requests will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 p-5 sm:p-6">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-black text-slate-900">
                          {booking.customerName}
                        </h3>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </div>

                      <p className="mt-1 text-sm text-slate-500">
                        {booking.service}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                      <span className="rounded-full bg-white px-3 py-1">
                        {booking.date}
                      </span>

                      <span className="rounded-full bg-white px-3 py-1">
                        {booking.time}
                      </span>

                      <span className="rounded-full bg-white px-3 py-1 text-blue-700">
                        ${getServicePrice(booking.service).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
          <h2 className="text-xl font-black text-slate-900">
            Business Snapshot
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Quick overview for the owner.
          </p>

          <div className="mt-6 space-y-4">
            <SnapshotItem
              icon={<CalendarCheck size={20} />}
              label="Confirmed"
              value={confirmedBookings}
            />

            <SnapshotItem
              icon={<Clock size={20} />}
              label="Pending"
              value={pendingBookings}
            />

            <SnapshotItem
              icon={<ListChecks size={20} />}
              label="Declined"
              value={declinedBookings}
            />

            <SnapshotItem
              icon={<ListChecks size={20} />}
              label="Cancelled"
              value={cancelledBookings}
            />

            <SnapshotItem
              icon={<DollarSign size={20} />}
              label="Revenue"
              value={`$${estimatedRevenue.toLocaleString()}`}
            />
          </div>

          <Link
            to="/admin/services"
            className="mt-6 block rounded-xl border border-slate-300 px-4 py-3 text-center font-bold text-slate-700 hover:bg-slate-100"
          >
            Manage Services
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function SnapshotItem({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-xl bg-blue-100 p-2 text-blue-700">{icon}</div>
        <p className="font-bold text-slate-700">{label}</p>
      </div>

      <p className="font-black text-slate-950">{value}</p>
    </div>
  );
}

export default AdminDashboard;
