import { useState } from "react";
import { Building2, RotateCcw, Save } from "lucide-react";
import PageShell from "../components/PageShell";
import { useBusinessSettings } from "../hooks/useBusinessSettings";

function AdminSettings() {
  const {
    settings,
    settingsLoading,
    settingsError,
    updateSettings,
    resetSettings,
  } = useBusinessSettings();

  if (settingsLoading) {
    return (
      <PageShell title="Business Settings" subtitle="Loading settings...">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg">
          <p className="font-bold text-slate-700">
            Loading business settings...
          </p>
        </div>
      </PageShell>
    );
  }

  if (settingsError) {
    return (
      <PageShell title="Business Settings" subtitle="Something went wrong.">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center shadow-lg">
          <p className="font-bold text-red-700">{settingsError}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <SettingsForm
      key={settings.updatedAt || settings.businessName}
      initialSettings={settings}
      updateSettings={updateSettings}
      resetSettings={resetSettings}
    />
  );
}

function SettingsForm({ initialSettings, updateSettings, resetSettings }) {
  const [formData, setFormData] = useState({
    businessName: initialSettings.businessName || "",
    tagline: initialSettings.tagline || "",
    phone: initialSettings.phone || "",
    email: initialSettings.email || "",
    address: initialSettings.address || "",
  });

  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    const result = await updateSettings(formData);

    if (!result.success) {
      setMessage(result.message);
      setSaving(false);
      return;
    }

    setMessage("Business settings saved.");
    setSaving(false);
  };

  const handleReset = async () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset business settings?",
    );

    if (!confirmReset) return;

    setSaving(true);
    setMessage("");

    const result = await resetSettings();

    if (!result.success) {
      setMessage(result.message);
      setSaving(false);
      return;
    }

    setMessage("Business settings reset.");
    setSaving(false);
  };

  return (
    <PageShell
      title="Business Settings"
      subtitle="Customize this app for each client or business."
    >
      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
              <Building2 />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">
                Business Info
              </h2>
              <p className="text-sm text-slate-500">
                These details now save to MongoDB.
              </p>
            </div>
          </div>

          {message && (
            <div className="mb-5 rounded-2xl border border-blue-200 bg-blue-50 p-4 font-semibold text-blue-700">
              {message}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <TextField
              label="Business Name"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Lavonda Beauty Studio"
            />

            <TextField
              label="Tagline"
              name="tagline"
              value={formData.tagline}
              onChange={handleChange}
              placeholder="Book your appointment with ease."
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="(555) 555-5555"
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="hello@business.com"
            />

            <TextField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="123 Main Street"
            />

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <Save size={18} />
              {saving ? "Saving..." : "Save Settings"}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RotateCcw size={18} />
              Reset Defaults
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-black text-slate-900">Live Preview</h2>
          <p className="mt-1 text-sm text-slate-500">
            This is how client branding can appear.
          </p>

          <div className="mt-6 rounded-[2rem] bg-gradient-to-br from-blue-50 to-slate-100 p-6">
            <p className="mb-3 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
              Client Booking Portal
            </p>

            <h3 className="text-4xl font-black text-slate-950">
              {formData.businessName}
            </h3>

            <p className="mt-3 max-w-xl text-lg leading-8 text-slate-600">
              {formData.tagline}
            </p>

            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4">
                <p className="text-slate-400">Phone</p>
                <p>{formData.phone}</p>
              </div>

              <div className="rounded-2xl bg-white p-4">
                <p className="text-slate-400">Email</p>
                <p>{formData.email}</p>
              </div>

              <div className="rounded-2xl bg-white p-4 sm:col-span-2">
                <p className="text-slate-400">Address</p>
                <p>{formData.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

function TextField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-800">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
      />
    </div>
  );
}

export default AdminSettings;
