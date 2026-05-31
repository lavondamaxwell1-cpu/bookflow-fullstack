import { Link } from "react-router-dom";
import { Scissors } from "lucide-react";
import PageShell from "../components/PageShell";
import { useServices } from "../hooks/useServices";

function Services() {
  const { services } = useServices();
  const activeServices = services.filter((service) => service.active);

  return (
    <PageShell title="Services" subtitle="Choose a service package.">
      {activeServices.length === 0 ? (
        <div className="rounded-[2rem] border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="font-bold text-slate-700">No services available.</p>
          <p className="mt-1 text-sm text-slate-500">Please check back soon.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {activeServices.map((service) => (
            <div
              key={service.id}
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-lg"
            >
              <Scissors className="mb-4 text-blue-700" />

              <h3 className="text-xl font-black text-slate-900">
                {service.name}
              </h3>

              <p className="mt-2 text-slate-600">{service.description}</p>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-2xl font-black text-blue-700">
                  ${Number(service.price).toFixed(2)}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-bold text-slate-600">
                  {service.duration}
                </span>
              </div>

              <Link
                to={`/book?service=${encodeURIComponent(service.name)}`}
                className="mt-6 block rounded-xl bg-blue-700 px-4 py-3 text-center font-bold text-white hover:bg-blue-800"
              >
                Book This
              </Link>
            </div>
          ))}
        </div>
      )}
    </PageShell>
  );
}

export default Services;
