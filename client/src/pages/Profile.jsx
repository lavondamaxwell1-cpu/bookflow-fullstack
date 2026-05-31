import { useState } from "react";
import { Navigate } from "react-router-dom";
import { Save, UserCircle } from "lucide-react";
import PageShell from "../components/PageShell";
import { useAuth } from "../hooks/useAuth";

function Profile() {
  const { user, isLoggedIn, updateProfile } = useAuth();
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  });

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

 const handleSubmit = async (e) => {
   e.preventDefault();

   const result = await updateProfile(formData);

   if (!result.success) {
     setMessage(result.message);
     return;
   }

   setMessage("Profile updated successfully.");
 };

  return (
    <PageShell
      title="My Profile"
      subtitle="Update your account details for faster booking."
    >
      <div className="mx-auto max-w-2xl rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
            <UserCircle />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900">
              Account Details
            </h2>
            <p className="text-sm text-slate-500">
              These details can auto-fill your booking form.
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 p-4 font-semibold text-green-700">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />

          <Field
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@email.com"
          />

          <Field
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 555-5555"
          />

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            <Save size={18} />
            Save Profile
          </button>
        </form>
      </div>
    </PageShell>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
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

export default Profile;
