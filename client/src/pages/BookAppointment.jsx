import { useMemo, useState } from "react";
import { CalendarCheck, Clock, RefreshCcw } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useBookings } from "../hooks/useBookings";
import { useBusinessSettings } from "../hooks/useBusinessSettings";
import { useServices } from "../hooks/useServices";

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const getToday = () => {
  return new Date().toISOString().split("T")[0];
};

const timeToMinutes = (time) => {
  const [hours, minutes] = String(time || "00:00")
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`;
};

const formatTimeLabel = (time) => {
  const [hourString, minuteString] = time.split(":");
  const hourNumber = Number(hourString);
  const suffix = hourNumber >= 12 ? "PM" : "AM";
  const displayHour = hourNumber % 12 || 12;

  return `${displayHour}:${minuteString} ${suffix}`;
};

const generateTimeSlots = ({ openingTime, closingTime, slotInterval }) => {
  const start = timeToMinutes(openingTime || "09:00");
  const end = timeToMinutes(closingTime || "17:00");
  const interval = Number(slotInterval || 30);

  if (start >= end || interval <= 0) return [];

  const slots = [];

  for (let current = start; current <= end; current += interval) {
    const value = minutesToTime(current);

    slots.push({
      label: formatTimeLabel(value),
      value,
    });
  }

  return slots;
};

export default function BookAppointment() {
  const [searchParams] = useSearchParams();
  const serviceFromUrl = searchParams.get("service") || "";

  const { user, isLoggedIn } = useAuth();
  const { bookings, addBooking, fetchBookings } = useBookings();
  const { settings } = useBusinessSettings();
  const { services } = useServices();

  const [form, setForm] = useState({
    customerName: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    service: serviceFromUrl,
    date: "",
    time: "",
    notes: "",
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const businessHours = {
    openingTime: settings?.openingTime || "09:00",
    closingTime: settings?.closingTime || "17:00",
    slotInterval: settings?.slotInterval || 30,
    closedDays: settings?.closedDays || ["Sunday"],
  };

  const timeSlots = useMemo(() => {
    return generateTimeSlots(businessHours);
  }, [
    businessHours.openingTime,
    businessHours.closingTime,
    businessHours.slotInterval,
  ]);

  const selectedDayName = useMemo(() => {
    if (!form.date) return "";

    const selectedDate = new Date(`${form.date}T00:00:00`);

    if (Number.isNaN(selectedDate.getTime())) return "";

    return dayNames[selectedDate.getDay()];
  }, [form.date]);

  const isSelectedDateClosed = useMemo(() => {
    if (!selectedDayName) return false;

    return businessHours.closedDays.includes(selectedDayName);
  }, [businessHours.closedDays, selectedDayName]);

  const activeServices = useMemo(() => {
    return services.filter((service) => service.active !== false);
  }, [services]);

  const bookedTimesForSelectedDate = useMemo(() => {
    if (!form.date) return new Set();

    const blockedStatuses = ["Pending", "Confirmed"];

    const bookedTimes = bookings
      .filter((booking) => {
        return (
          booking.date === form.date && blockedStatuses.includes(booking.status)
        );
      })
      .map((booking) => booking.time);

    return new Set(bookedTimes);
  }, [bookings, form.date]);

  const availableTimeSlots = useMemo(() => {
    if (isSelectedDateClosed) return [];

    return timeSlots.filter(
      (slot) => !bookedTimesForSelectedDate.has(slot.value),
    );
  }, [bookedTimesForSelectedDate, isSelectedDateClosed, timeSlots]);

  const selectedService = useMemo(() => {
    return activeServices.find((service) => service.name === form.service);
  }, [activeServices, form.service]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setSuccessMessage("");
    setErrorMessage("");

    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));
  };

  const handleRefreshAvailability = async () => {
    try {
      setRefreshing(true);
      setErrorMessage("");
      await fetchBookings();
    } catch (err) {
      setErrorMessage(err.message || "Failed to refresh availability.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.customerName || !form.email || !form.phone) {
      setErrorMessage("Please enter your name, email, and phone number.");
      return;
    }

    if (!form.service || !form.date || !form.time) {
      setErrorMessage("Please choose a service, date, and available time.");
      return;
    }

    if (isSelectedDateClosed) {
      setErrorMessage(
        `Sorry, this business is closed on ${selectedDayName}. Please choose another date.`,
      );
      return;
    }

    try {
      setSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      await addBooking(form);

      setSuccessMessage(
        "Your booking request was received. Please check your email for confirmation.",
      );

      setForm({
        customerName: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        service: serviceFromUrl,
        date: "",
        time: "",
        notes: "",
      });
    } catch (err) {
      setErrorMessage(err.message || "Failed to create booking.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
              Book Appointment
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Choose your service and available time
            </h1>
            <p className="mt-2 text-slate-600">
              Pick a date, then choose from the open time slots.
            </p>
          </div>

          {!isLoggedIn && (
            <div className="mb-6 rounded-2xl border border-indigo-100 bg-indigo-50 p-4 text-sm text-indigo-800">
              Already have an account?{" "}
              <Link to="/login" className="font-bold underline">
                Log in
              </Link>{" "}
              to make booking faster.
            </div>
          )}

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
              {successMessage}
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
              {errorMessage}
            </div>
          )}

          {form.date && isSelectedDateClosed && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">
              This business is closed on {selectedDayName}. Please choose
              another date.
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Name
                </label>
                <input
                  name="customerName"
                  value={form.customerName}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Your full name"
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
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Phone number"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Service
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                >
                  <option value="">Select service</option>
                  {activeServices.map((service) => (
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
                  value={form.date}
                  min={getToday()}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <div className="mb-1 flex items-center justify-between gap-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    Available Time
                  </label>

                  <button
                    type="button"
                    onClick={handleRefreshAvailability}
                    disabled={refreshing}
                    className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 disabled:opacity-50"
                  >
                    <RefreshCcw className="h-3.5 w-3.5" />
                    {refreshing ? "Refreshing..." : "Refresh"}
                  </button>
                </div>

                <select
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  disabled={
                    !form.date ||
                    isSelectedDateClosed ||
                    availableTimeSlots.length === 0
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
                  required
                >
                  {!form.date && <option value="">Choose a date first</option>}

                  {form.date && isSelectedDateClosed && (
                    <option value="">Closed on {selectedDayName}</option>
                  )}

                  {form.date &&
                    !isSelectedDateClosed &&
                    availableTimeSlots.length === 0 && (
                      <option value="">No open times for this date</option>
                    )}

                  {form.date &&
                    !isSelectedDateClosed &&
                    availableTimeSlots.length > 0 && (
                      <option value="">Select available time</option>
                    )}

                  {availableTimeSlots.map((slot) => (
                    <option key={slot.value} value={slot.value}>
                      {slot.label}
                    </option>
                  ))}
                </select>

                {form.date && !isSelectedDateClosed && (
                  <p className="mt-2 text-xs text-slate-500">
                    Hours: {formatTimeLabel(businessHours.openingTime)} -{" "}
                    {formatTimeLabel(businessHours.closingTime)} · Every{" "}
                    {businessHours.slotInterval} minutes
                  </p>
                )}

                {form.date &&
                  !isSelectedDateClosed &&
                  bookedTimesForSelectedDate.size > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      {bookedTimesForSelectedDate.size} time slot
                      {bookedTimesForSelectedDate.size === 1 ? "" : "s"} already
                      booked on this date.
                    </p>
                  )}
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-semibold text-slate-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows="4"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
                  placeholder="Anything we should know?"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting || isSelectedDateClosed}
              className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Sending Request..." : "Request Booking"}
            </button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-200 bg-slate-900 p-6 text-white shadow-sm">
            <CalendarCheck className="mb-4 h-10 w-10 text-indigo-300" />
            <h2 className="text-2xl font-bold">Booking Summary</h2>

            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="text-slate-400">Service</p>
                <p className="font-semibold">
                  {form.service || "No service selected"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Date</p>
                <p className="font-semibold">
                  {form.date || "No date selected"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Time</p>
                <p className="font-semibold">
                  {form.time
                    ? timeSlots.find((slot) => slot.value === form.time)
                        ?.label || form.time
                    : "No time selected"}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Business Hours</p>
                <p className="font-semibold">
                  {formatTimeLabel(businessHours.openingTime)} -{" "}
                  {formatTimeLabel(businessHours.closingTime)}
                </p>
                <p className="text-slate-300">
                  Closed:{" "}
                  {businessHours.closedDays.length > 0
                    ? businessHours.closedDays.join(", ")
                    : "No closed days"}
                </p>
              </div>

              {selectedService && (
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="font-semibold">{selectedService.name}</p>
                  <p className="mt-1 text-slate-300">
                    {selectedService.description}
                  </p>
                  <p className="mt-2 font-bold">
                    ${selectedService.price} · {selectedService.duration} mins
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-indigo-50 p-6">
            <Clock className="mb-3 h-8 w-8 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Smart availability
            </h3>
            <p className="mt-2 text-sm text-slate-600">
              Time slots now come from Admin Settings, and pending/confirmed
              bookings automatically block unavailable times.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
