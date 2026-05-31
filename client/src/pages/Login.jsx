import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/PageShell";
import Input from "../components/Input";
import { useAuth } from "../hooks/useAuth";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "admin@bookflow.com",
    password: "admin123",
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

    const result = await login(formData);

    if (!result.success) {
      setError(result.message);
      return;
    }

    if (result.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/portal");
    }
  };
  return (
    <PageShell title="Login" subtitle="Login to manage your account.">
      <div className="mx-auto max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 font-semibold text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="admin@bookflow.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="admin123"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-bold text-slate-800">Demo Admin Login</p>
          <p>Email: admin@bookflow.com</p>
          <p>Password: admin123</p>
        </div>

        <p className="mt-5 text-center text-sm text-slate-600">
          Need a customer account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-700 hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </PageShell>
  );
}

export default Login;
