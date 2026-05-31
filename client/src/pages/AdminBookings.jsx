import { useState } from "react";
import { Search } from "lucide-react";
import PageShell from "../components/PageShell";
import { useBookings } from "../hooks/useBookings";

function AdminBookings() {
  const { bookings, updateBookingStatus, deleteBooking } = useBookings();
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("Newest First");
  const filters = ["All", "Pending", "Confirmed", "Declined", "Cancelled"];

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      statusFilter === "All" || booking.status === statusFilter;

    const searchText = searchTerm.toLowerCase();

    const matchesSearch =
      booking.customerName.toLowerCase().includes(searchText) ||
      booking.email.toLowerCase().includes(searchText) ||
      booking.phone.toLowerCase().includes(searchText) ||
      booking.service.toLowerCase().includes(searchText) ||
      booking.status.toLowerCase().includes(searchText) ||
      booking.date.toLowerCase().includes(searchText);

    return matchesStatus && matchesSearch;
  });

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    if (sortBy === "Newest First") {
      return Number(b.id) - Number(a.id);
    }

    if (sortBy === "Oldest First") {
      return Number(a.id) - Number(b.id);
    }

    if (sortBy === "Date Soonest") {
      return new Date(a.date) - new Date(b.date);
    }

    if (sortBy === "Date Latest") {
      return new Date(b.date) - new Date(a.date);
    }

    return 0;
  });

  const getStatusClass = (status) => {
    if (status === "Confirmed") return "bg-green-100 text-green-700";
    if (status === "Declined") return "bg-red-100 text-red-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Cancelled") return "bg-slate-200 text-slate-700";

    return "bg-slate-100 text-slate-700";
  };

  const handleDelete = (bookingId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (confirmDelete) {
      deleteBooking(bookingId);
    }
  };

  return (
    <PageShell
      title="Admin Bookings"
      subtitle="View, search, and manage customer booking requests."
    >
      <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-200 p-4 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-xl font-black text-slate-900">
                Booking Requests
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Search, approve, decline, delete, and filter appointments.
              </p>
            </div>

            <div className="grid w-full gap-3 lg:max-w-2xl lg:grid-cols-[1fr_180px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search bookings..."
                  className="w-full rounded-xl border border-slate-300 py-3 pl-11 pr-4 outline-none focus:border-blue-700"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold text-slate-700 outline-none focus:border-blue-700"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>Date Soonest</option>
                <option>Date Latest</option>
              </select>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setStatusFilter(filter)}
                className={
                  statusFilter === filter
                    ? "rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white"
                    : "rounded-xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200"
                }
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {sortedBookings.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold text-slate-700">No bookings found.</p>
            <p className="mt-1 text-sm text-slate-500">
              Try a different search or filter.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="grid gap-4 p-4 md:hidden">
              {sortedBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  getStatusClass={getStatusClass}
                  updateBookingStatus={updateBookingStatus}
                  handleDelete={handleDelete}
                />
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Service
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Date
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Time
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {sortedBookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-bold text-slate-900">
                          {booking.customerName}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.email}
                        </p>
                        <p className="text-sm text-slate-500">
                          {booking.phone}
                        </p>
                      </td>

                      <td className="px-6 py-4 font-semibold text-slate-700">
                        {booking.service}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {booking.date}
                      </td>

                      <td className="px-6 py-4 text-slate-600">
                        {booking.time}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${getStatusClass(
                            booking.status,
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <ActionButtons
                          booking={booking}
                          updateBookingStatus={updateBookingStatus}
                          handleDelete={handleDelete}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

function BookingCard({
  booking,
  getStatusClass,
  updateBookingStatus,
  handleDelete,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-black text-slate-900">{booking.customerName}</h3>
          <p className="text-sm text-slate-500">{booking.email}</p>
          <p className="text-sm text-slate-500">{booking.phone}</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
            booking.status,
          )}`}
        >
          {booking.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <InfoRow label="Service" value={booking.service} />
        <InfoRow label="Date" value={booking.date} />
        <InfoRow label="Time" value={booking.time} />

        {booking.notes && (
          <div className="rounded-xl bg-white p-3">
            <p className="font-bold text-slate-500">Notes</p>
            <p className="mt-1 text-slate-700">{booking.notes}</p>
          </div>
        )}
      </div>

      <div className="mt-5">
        <ActionButtons
          booking={booking}
          updateBookingStatus={updateBookingStatus}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="font-bold text-slate-500">{label}</span>
      <span className="text-right font-semibold text-slate-800">{value}</span>
    </div>
  );
}

function ActionButtons({ booking, updateBookingStatus, handleDelete }) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
      <button
        type="button"
        onClick={() => updateBookingStatus(booking.id, "Confirmed")}
        disabled={booking.status === "Confirmed"}
        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Approve
      </button>

      <button
        type="button"
        onClick={() => updateBookingStatus(booking.id, "Declined")}
        disabled={booking.status === "Declined"}
        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Decline
      </button>

      <button
        type="button"
        onClick={() => handleDelete(booking.id)}
        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
      >
        Delete
      </button>
    </div>
  );
}

export default AdminBookings;
