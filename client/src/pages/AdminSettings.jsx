import { useState } from "react";
import { RefreshCcw, Save } from "lucide-react";
import { useBusinessSettings } from "../hooks/useBusinessSettings";

const dayOptions = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const defaultForm = {
  businessName: "BookFlow",
  tagline: "Simple booking for modern businesses.",
  phone: "",
  email: "",
  address: "",
  openingTime: "09:00",
  closingTime: "17:00",
  slotInterval: 30,
  closedDays: ["Sunday"],
};

function SettingsForm({ initialSettings, onSave, onReset }) {
  const [form, setForm] = useState({
    ...defaultForm,
    ...initialSettings,
    closedDays: initialSettings?.closedDays || ["Sunday"],
  });

  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState("");
  const [formError, setFormError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMessage("");
    setFormError("");

    setForm((prev) => ({
      ...prev,
      [name]: name === "slotInterval" ? Number(value) : value,
    }));
  };

  const toggleClosedDay = (day) => {
    setMessage("");
    setFormError("");

    setForm((prev) => {
      const alreadyClosed = prev.closedDays.includes(day);

      return {
        ...prev,
        closedDays: alreadyClosed
          ? prev.closedDays.filter((item) => item !== day)
          : [...prev.closedDays, day],
      };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (form.openingTime >= form.closingTime) {
      setFormError("Opening time must be earlier than closing time.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");
      setFormError("");

      await onSave(form);

      setMessage("Settings saved successfully.");
    } catch (err) {
      setFormError(err.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    const confirmed = window.confirm(
      "Reset all business settings back to the default BookFlow settings?",
    );

    if (!confirmed) return;

    try {
      setResetting(true);
      setMessage("");
      setFormError("");

      const resetSettings = await onReset();

      setForm({
        ...defaultForm,
        ...resetSettings,
        closedDays: resetSettings?.closedDays || ["Sunday"],
      });

      setMessage("Settings reset successfully.");
    } catch (err) {
      setFormError(err.message || "Failed to reset settings.");
    } finally {
      setResetting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-700">
          {message}
        </div>
      )}

      {formError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {formError}
        </div>
      )}

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">
          Business Information
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          This information appears across the public booking site.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Business Name
            </label>
            <input
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Tagline
            </label>
            <input
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
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
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Booking Hours</h2>
        <p className="mt-1 text-sm text-slate-500">
          These settings will control the customer time dropdown.
        </p>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Opening Time
            </label>
            <input
              type="time"
              name="openingTime"
              value={form.openingTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Closing Time
            </label>
            <input
              type="time"
              name="closingTime"
              value={form.closingTime}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Slot Interval
            </label>
            <select
              name="slotInterval"
              value={form.slotInterval}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-indigo-500"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>60 minutes</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Closed Days
          </p>

          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
            {dayOptions.map((day) => {
              const isClosed = form.closedDays.includes(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleClosedDay(day)}
                  className={`rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                    isClosed
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {day}
                  <span className="ml-2 text-xs">
                    {isClosed ? "Closed" : "Open"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting || saving}
          className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCcw className="h-4 w-4" />
          {resetting ? "Resetting..." : "Reset Defaults"}
        </button>

        <button
          type="submit"
          disabled={saving || resetting}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save className="h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </form>
  );
}

export default function AdminSettings() {
  const settingsContext = useBusinessSettings();

  const settings = settingsContext.settings;
  const loading = settingsContext.loading ?? settingsContext.settingsLoading;
  const error = settingsContext.error ?? settingsContext.settingsError;

  const saveSettings =
    settingsContext.updateSettings || settingsContext.updateBusinessSettings;

  const resetSettings =
    settingsContext.resetSettings || settingsContext.resetBusinessSettings;

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Admin
          </p>
          <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          Loading settings...
        </div>
      </div>
    );
  }

  if (!saveSettings || !resetSettings) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
        Settings actions are missing from BusinessSettingsProvider.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-slate-600">
          Manage business details, booking hours, and closed days.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      <SettingsForm
        key={settings?._id || settings?.updatedAt || "settings-form"}
        initialSettings={settings}
        onSave={saveSettings}
        onReset={resetSettings}
      />
    </div>
  );
}
