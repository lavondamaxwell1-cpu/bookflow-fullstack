import { useEffect, useState } from "react";
import { Mail, Phone, UserCircle } from "lucide-react";
import PageShell from "../components/PageShell";
import { useBookings } from "../hooks/useBookings";
import api from "../api/api";

function AdminCustomers() {
  const { bookings } = useBookings();
  const [customers, setCustomers] = useState([]);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [customersError, setCustomersError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setCustomersLoading(true);

        const { data } = await api.get("/users/customers");

        setCustomers(data.customers);
        setCustomersError("");
      } catch (error) {
        console.error("Fetch customers error:", error);
        setCustomersError(
          error.response?.data?.message || "Could not load customers.",
        );
      } finally {
        setCustomersLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const getCustomerBookings = (email) =>
    bookings.filter(
      (booking) => booking.email.toLowerCase() === email.toLowerCase(),
    );

  if (customersLoading) {
    return (
      <PageShell title="Admin Customers" subtitle="Loading customers...">
        <div className="rounded-[2rem] border border-slate-200 bg-white p-8 text-center shadow-lg">
          <p className="font-bold text-slate-700">Loading customers...</p>
        </div>
      </PageShell>
    );
  }

  if (customersError) {
    return (
      <PageShell title="Admin Customers" subtitle="Something went wrong.">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center shadow-lg">
          <p className="font-bold text-red-700">{customersError}</p>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Admin Customers"
      subtitle="View customer accounts and booking history."
    >
      <div className="rounded-[2rem] border border-slate-200 bg-white shadow-lg">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <h2 className="text-xl font-black text-slate-900">Customers</h2>
          <p className="mt-1 text-sm text-slate-500">
            {customers.length} customer account
            {customers.length === 1 ? "" : "s"} created.
          </p>
        </div>

        {customers.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-bold text-slate-700">No customers yet.</p>
            <p className="mt-1 text-sm text-slate-500">
              Customers will appear here after they register.
            </p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 p-4 md:hidden">
              {customers.map((customer) => {
                const customerBookings = getCustomerBookings(customer.email);

                return (
                  <div
                    key={customer.id}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                        <UserCircle />
                      </div>

                      <div>
                        <h3 className="font-black text-slate-900">
                          {customer.name}
                        </h3>
                        <p className="text-sm text-slate-500">
                          Customer account
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 text-sm">
                      <p className="flex items-center gap-2 text-slate-700">
                        <Mail size={16} />
                        {customer.email}
                      </p>

                      <p className="flex items-center gap-2 text-slate-700">
                        <Phone size={16} />
                        {customer.phone || "No phone saved"}
                      </p>

                      <div className="rounded-xl bg-white p-3">
                        <p className="font-bold text-slate-500">
                          Total Bookings
                        </p>
                        <p className="text-2xl font-black text-blue-700">
                          {customerBookings.length}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[850px] text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Email
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-sm font-black text-slate-600">
                      Bookings
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {customers.map((customer) => {
                    const customerBookings = getCustomerBookings(
                      customer.email,
                    );

                    return (
                      <tr key={customer.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
                              <UserCircle size={22} />
                            </div>

                            <div>
                              <p className="font-bold text-slate-900">
                                {customer.name}
                              </p>
                              <p className="text-sm text-slate-500">Customer</p>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {customer.email}
                        </td>

                        <td className="px-6 py-4 text-slate-700">
                          {customer.phone || "No phone saved"}
                        </td>

                        <td className="px-6 py-4">
                          <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700">
                            {customerBookings.length}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </PageShell>
  );
}

export default AdminCustomers;
