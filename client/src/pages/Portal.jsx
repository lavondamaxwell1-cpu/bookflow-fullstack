import { useState } from "react";
import { Link } from "react-router-dom";
import { CalendarCheck, Search, XCircle, UserCircle } from "lucide-react";
import PageShell from "../components/PageShell";
import { useBookings } from "../hooks/useBookings";
import { useAuth } from "../hooks/useAuth";

function Portal() {
  const { bookings, updateBookingStatus } = useBookings();
  const { user, isCustomer, isLoggedIn } = useAuth();

  const [emailSearch, setEmailSearch] = useState("");
  const [searchedEmail, setSearchedEmail] = useState("");

  const activeEmail = isCustomer ? user.email : searchedEmail;

  const customerBookings = bookings.filter(
    (booking) =>
      activeEmail && booking.email.toLowerCase() === activeEmail.toLowerCase(),
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchedEmail(emailSearch.trim());
  };

  const getStatusClass = (status) => {
    if (status === "Confirmed") return "bg-green-100 text-green-700";
    if (status === "Pending") return "bg-yellow-100 text-yellow-700";
    if (status === "Declined") return "bg-red-100 text-red-700";
    if (status === "Cancelled") return "bg-slate-200 text-slate-700";

    return "bg-slate-100 text-slate-700";
  };

  return (
    <PageShell
      title="Client Portal"
      subtitle="Customers can view and manage their appointment requests."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
          {isCustomer ? (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                  <UserCircle />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Welcome, {user.name}
                  </h2>
                  <p className="text-sm text-slate-500">{user.email}</p>
                </div>
              </div>

              <div className="rounded-2xl bg-blue-50 p-4 text-sm font-semibold text-blue-700">
                Your appointments are shown automatically because you are logged
                in.
              </div>
            </>
          ) : (
            <>
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                  <Search />
                </div>

                <div>
                  <h2 className="text-xl font-black text-slate-900">
                    Find My Bookings
                  </h2>
                  <p className="text-sm text-slate-500">
                    Enter the email used when booking.
                  </p>
                </div>
              </div>

              {!isLoggedIn && (
                <div className="mb-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                  <p className="font-bold text-slate-800">
                    Want easier access?
                  </p>
                  <p className="mt-1">
                    Create an account so your bookings show automatically.
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      to="/register"
                      className="rounded-xl bg-blue-700 px-4 py-2 font-bold text-white hover:bg-blue-800"
                    >
                      Register
                    </Link>

                    <Link
                      to="/login"
                      className="rounded-xl border border-slate-300 px-4 py-2 font-bold text-slate-700 hover:bg-slate-100"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              )}

              <form onSubmit={handleSearch} className="space-y-4">
                <div>
                  <label className="mb-2 block font-bold text-slate-800">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    placeholder="jane@email.com"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
                >
                  Search Bookings
                </button>
              </form>
            </>
          )}
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 p-5 sm:p-6">
            <h2 className="text-xl font-black text-slate-900">
              My Appointments
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              View booking status and cancel pending or confirmed appointments.
            </p>
          </div>

          {!activeEmail ? (
            <EmptyState
              title="Search for your bookings"
              text="Use your email address to pull up appointment requests."
            />
          ) : customerBookings.length === 0 ? (
            <EmptyState
              title="No bookings found"
              text={`We did not find bookings for ${activeEmail}.`}
            />
          ) : (
            <div className="grid gap-4 p-5 sm:p-6">
              {customerBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex gap-4">
                      <div className="hidden rounded-2xl bg-blue-100 p-3 text-blue-700 sm:block">
                        <CalendarCheck />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-black text-slate-900">
                            {booking.service}
                          </h3>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusClass(
                              booking.status,
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-slate-600">
                          {booking.date} at {booking.time}
                        </p>

                        {booking.notes && (
                          <p className="mt-3 rounded-xl bg-white p-3 text-sm text-slate-600">
                            {booking.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {booking.status !== "Cancelled" &&
                      booking.status !== "Declined" && (
                        <button
                          type="button"
                          onClick={() =>
                            updateBookingStatus(booking.id, "Cancelled")
                          }
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
                        >
                          <XCircle size={16} />
                          Cancel
                        </button>
                      )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}

function EmptyState({ title, text }) {
  return (
    <div className="p-8 text-center">
      <p className="font-bold text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-500">{text}</p>
    </div>
  );
}

export default Portal;
