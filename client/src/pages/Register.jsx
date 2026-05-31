import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await register(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    navigate("/portal");
  };

  return (
    <PageShell
      title="Create Account"
      subtitle="Customers can create an account to manage appointments."
    >
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jane Doe"
          />

          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="jane@email.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            Create Account
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-blue-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

export default Register;
