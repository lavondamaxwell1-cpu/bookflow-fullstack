import { useState } from "react";
import { Plus, Power, Scissors, Trash2 } from "lucide-react";
import PageShell from "../components/PageShell";
import { useServices } from "../hooks/useServices";

function AdminServices() {
  const { services, addService, toggleService, deleteService } = useServices();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
  });

  const activeServices = services.filter((service) => service.active).length;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddService = (e) => {
    e.preventDefault();

    addService(formData);

    setFormData({
      name: "",
      description: "",
      price: "",
      duration: "",
    });
  };

  return (
    <PageShell
      title="Admin Services"
      subtitle="Add, remove, and manage bookable services."
    >
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg">
          <div className="mb-5 flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
              <Plus />
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-900">Add Service</h2>
              <p className="text-sm text-slate-500">
                Create a new bookable service.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddService} className="space-y-4">
            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Service Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Deep Cleaning"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe what is included..."
                rows="4"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Price
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="75"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <div>
              <label className="mb-2 block font-bold text-slate-800">
                Duration
              </label>
              <input
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="45 min"
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-700 px-5 py-3 font-bold text-white hover:bg-blue-800"
            >
              Add Service
            </button>
          </form>
        </div>

        <div className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-black text-slate-900">Service List</h2>
            <p className="text-sm text-slate-500">
              {activeServices} active out of {services.length} total services
            </p>
          </div>

          <div className="grid gap-4 p-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                  <div className="flex gap-4">
                    <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                      <Scissors />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-black text-slate-900">
                          {service.name}
                        </h3>

                        <span
                          className={
                            service.active
                              ? "rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700"
                              : "rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600"
                          }
                        >
                          {service.active ? "Active" : "Hidden"}
                        </span>
                      </div>

                      <p className="mt-2 text-slate-600">
                        {service.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-700">
                          ${Number(service.price).toFixed(2)}
                        </span>

                        <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-slate-600">
                          {service.duration}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-700"
                    >
                      <Power size={16} />
                    </button>

                    <button
                      type="button"
                      onClick={() => deleteService(service.id)}
                      className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {services.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-8 text-center">
                <p className="font-bold text-slate-700">No services yet.</p>
                <p className="mt-1 text-sm text-slate-500">
                  Add your first service using the form.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default AdminServices;
