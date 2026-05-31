import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageShell from "../components/PageShell";
import { useBookings } from "../hooks/useBookings";
import { useServices } from "../hooks/useServices";
import { useAuth } from "../hooks/useAuth";

function BookAppointment() {
  const { addBooking } = useBookings();
  const { services } = useServices();
  const { user, isCustomer } = useAuth();
  const [searchParams] = useSearchParams();

  const activeServices = services.filter((service) => service.active);
  const serviceFromUrl = searchParams.get("service");

  const defaultService =
    activeServices.find((service) => service.name === serviceFromUrl)?.name ||
    activeServices[0]?.name ||
    "";

  const getEmptyForm = () => ({
    name: isCustomer ? user?.name || "" : "",
    email: isCustomer ? user?.email || "" : "",
    phone: isCustomer ? user?.phone || "" : "",
    date: "",
    time: "",
    service: defaultService,
    notes: "",
  });

  const [formData, setFormData] = useState(getEmptyForm);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.service) {
      setSuccessMessage("Please choose a service before submitting.");
      return;
    }

    const result = await addBooking(formData);

    if (!result.success) {
      setSuccessMessage(result.message);
      return;
    }

    setSuccessMessage(
      `Booking request sent for ${formData.service} on ${formData.date} at ${formData.time}.`,
    );

    setFormData(getEmptyForm());
  };
  return (
    <PageShell
      title="Book Appointment"
      subtitle="Customers can request an appointment here."
    >
      <div className="rounded-[2rem] border border-slate-200 bg-white p-4 shadow-lg sm:p-6">
        {isCustomer && (
          <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 p-4 font-semibold text-blue-700">
            Booking as {user.name} — {user.email}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
            {successMessage}
          </div>
        )}

        {activeServices.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
            <p className="font-bold text-slate-700">
              No services are available right now.
            </p>
            <p className="mt-1 text-sm text-slate-500">
              The business owner needs to activate at least one service.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Full Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Email
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="jane@email.com"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Phone
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 555-5555"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Preferred Date
              </label>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Preferred Time
              </label>
              <input
                name="time"
                type="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Service
              </label>
              <select
                name="service"
                value={formData.service || defaultService}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              >
                {activeServices.map((service) => (
                  <option key={service.id} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block font-bold text-slate-800">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="4"
                placeholder="Anything the business should know?"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <button
              type="submit"
              className="rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 md:col-span-2"
            >
              Submit Booking Request
            </button>
          </form>
        )}
      </div>
    </PageShell>
  );
}

export default BookAppointment;
