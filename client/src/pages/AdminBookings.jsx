import { useMemo, useState } from "react";
import { Edit, Search, Trash2 } from "lucide-react";
import { useBookings } from "../hooks/useBookings";
import { useServices } from "../hooks/useServices";

const statusOptions = ["Pending", "Confirmed", "Declined", "Cancelled"];

const emptyEditForm = {
  customerName: "",
  email: "",
  phone: "",
  service: "",
  date: "",
  time: "",
  status: "Pending",
  notes: "",
};

export default function AdminBookings() {
  const {
    bookings,
    loading,
    error,
    updateBooking,
    updateBookingStatus,
    deleteBooking,
  } = useBookings();

  const { services } = useServices();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [editingBooking, setEditingBooking] = useState(null);
  const [editForm, setEditForm] = useState(emptyEditForm);
  const [actionError, setActionError] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredBookings = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return [...bookings]
      .filter((booking) => {
        const matchesStatus =
          statusFilter === "All" || booking.status === statusFilter;

        const matchesSearch =
          !term ||
          booking.customerName?.toLowerCase().includes(term) ||
          booking.email?.toLowerCase().includes(term) ||
          booking.phone?.toLowerCase().includes(term) ||
          booking.service?.toLowerCase().includes(term);

        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return (
            new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date)
          );
        }

        if (sortBy === "date") {
          return (
            new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`)
          );
        }

        return (
          new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)
        );
      });
  }, [bookings, searchTerm, statusFilter, sortBy]);

  const openEditModal = (booking) => {
    setActionError("");
    setEditingBooking(booking);
    setEditForm({
      customerName: booking.customerName || "",
      email: booking.email || "",
      phone: booking.phone || "",
      service: booking.service || "",
      date: booking.date || "",
      time: booking.time || "",
      status: booking.status || "Pending",
      notes: booking.notes || "",
    });
  };

  const closeEditModal = () => {
    setEditingBooking(null);
    setEditForm(emptyEditForm);
    setActionError("");
    setSaving(false);
  };

  const handleEditChange = (event) => {
    const { name, value } = event.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async (event) => {
    event.preventDefault();

    if (!editingBooking) return;

    try {
      setSaving(true);
      setActionError("");

      await updateBooking(editingBooking.id, editForm);

      closeEditModal();
    } catch (err) {
      setActionError(err.message || "Failed to update booking.");
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (bookingId, status) => {
    try {
      setActionError("");
      await updateBookingStatus(bookingId, status);
    } catch (err) {
      setActionError(err.message || "Failed to update booking status.");
    }
  };

  const handleDelete = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );

    if (!confirmed) return;

    try {
      setActionError("");
      await deleteBooking(bookingId);
    } catch (err) {
      setActionError(err.message || "Failed to delete booking.");
    }
  };

  const statusBadgeClass = (status) => {
    if (status === "Confirmed") {
      return "bg-emerald-100 text-emerald-700";
    }

    if (status === "Declined") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Cancelled") {
      return "bg-gray-200 text-gray-700";
    }

    return "bg-amber-100 text-amber-700";
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Bookings</h1>
        <p className="mt-1 text-slate-600">
          Review, approve, decline, edit, and delete customer bookings.
        </p>
      </div>

      {(error || actionError) && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error || actionError}
        </div>
      )}

      <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-4">
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, email, phone, or service..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 outline-none focus:border-indigo-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="All">All Statuses</option>
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
          className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="date">Appointment Date</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
          No bookings found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Date/Time</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="align-top">
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900">
                        {booking.customerName}
                      </p>
                      <p className="text-slate-500">{booking.email}</p>
                      <p className="text-slate-500">{booking.phone}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="font-medium text-slate-900">
                        {booking.service}
                      </p>
                      {booking.notes && (
                        <p className="mt-1 max-w-xs text-slate-500">
                          {booking.notes}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      <p>{booking.date}</p>
                      <p>{booking.time}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => openEditModal(booking)}
                          className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </button>

                        {booking.status !== "Confirmed" && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "Confirmed")
                            }
                            className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            Confirm
                          </button>
                        )}

                        {booking.status !== "Declined" && (
                          <button
                            onClick={() =>
                              handleStatusChange(booking.id, "Declined")
                            }
                            className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700"
                          >
                            Decline
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(booking.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 p-4 lg:hidden">
            {filteredBookings.map((booking) => (
              <div
                key={booking.id}
                className="rounded-2xl border border-slate-200 p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">
                      {booking.customerName}
                    </h3>
                    <p className="text-sm text-slate-500">{booking.email}</p>
                    <p className="text-sm text-slate-500">{booking.phone}</p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusBadgeClass(
                      booking.status,
                    )}`}
                  >
                    {booking.status}
                  </span>
                </div>

                <p className="font-semibold text-slate-800">
                  {booking.service}
                </p>
                <p className="text-sm text-slate-500">
                  {booking.date} at {booking.time}
                </p>

                {booking.notes && (
                  <p className="mt-2 text-sm text-slate-600">{booking.notes}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => openEditModal(booking)}
                    className="rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleStatusChange(booking.id, "Confirmed")}
                    className="rounded-xl bg-emerald-600 px-3 py-2 text-xs font-bold text-white"
                  >
                    Confirm
                  </button>

                  <button
                    onClick={() => handleStatusChange(booking.id, "Declined")}
                    className="rounded-xl bg-red-600 px-3 py-2 text-xs font-bold text-white"
                  >
                    Decline
                  </button>

                  <button
                    onClick={() => handleDelete(booking.id)}
                    className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {editingBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Edit Booking
                </h2>
                <p className="text-sm text-slate-500">
                  Update customer details, appointment time, service, or status.
                </p>
              </div>

              <button
                onClick={closeEditModal}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600 hover:bg-slate-200"
              >
                X
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="grid gap-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Customer Name
                  </label>
                  <input
                    name="customerName"
                    value={editForm.customerName}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>
                  <input
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Service
                  </label>
                  <select
                    name="service"
                    value={editForm.service}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="">Select service</option>
                    {services.map((service) => (
                      <option
                        key={service.id || service._id}
                        value={service.name}
                      >
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={editForm.date}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Time
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={editForm.time}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-semibold text-slate-700">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    rows="4"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {actionError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {actionError}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
