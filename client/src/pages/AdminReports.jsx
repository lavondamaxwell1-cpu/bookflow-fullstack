import { useMemo } from "react";
import {
  BarChart3,
  CalendarCheck,
  Clock,
  DollarSign,
  Star,
  XCircle,
} from "lucide-react";
import { useBookings } from "../hooks/useBookings";
import { useServices } from "../hooks/useServices";

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const getBookingMonth = (booking) => {
  if (!booking.date) return null;

  const date = new Date(`${booking.date}T00:00:00`);

  if (Number.isNaN(date.getTime())) return null;

  return date.getMonth();
};

export default function AdminReports() {
  const { bookings, loading, error } = useBookings();
  const { services } = useServices();

  const reports = useMemo(() => {
    const confirmedBookings = bookings.filter(
      (booking) => booking.status === "Confirmed"
    );

    const pendingBookings = bookings.filter(
      (booking) => booking.status === "Pending"
    );

    const cancelledBookings = bookings.filter(
      (booking) => booking.status === "Cancelled"
    );

    const declinedBookings = bookings.filter(
      (booking) => booking.status === "Declined"
    );

    const servicePriceMap = new Map(
      services.map((service) => [service.name, Number(service.price || 0)])
    );

    const estimatedRevenue = confirmedBookings.reduce((total, booking) => {
      const price = servicePriceMap.get(booking.service) || 0;
      return total + price;
    }, 0);

    const serviceCounts = bookings.reduce((acc, booking) => {
      const serviceName = booking.service || "Unknown Service";
      acc[serviceName] = (acc[serviceName] || 0) + 1;
      return acc;
    }, {});

    const servicePopularity = Object.entries(serviceCounts)
      .map(([service, count]) => ({
        service,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    const mostBookedService = servicePopularity[0]?.service || "No data yet";

    const monthlyCounts = Array.from({ length: 12 }, (_, index) => ({
      month: monthNames[index],
      count: 0,
    }));

    bookings.forEach((booking) => {
      const monthIndex = getBookingMonth(booking);

      if (monthIndex !== null) {
        monthlyCounts[monthIndex].count += 1;
      }
    });

    const maxMonthlyCount = Math.max(
      1,
      ...monthlyCounts.map((item) => item.count)
    );

    const maxServiceCount = Math.max(
      1,
      ...servicePopularity.map((item) => item.count)
    );

    return {
      totalBookings: bookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      cancelledBookings: cancelledBookings.length,
      declinedBookings: declinedBookings.length,
      estimatedRevenue,
      mostBookedService,
      monthlyCounts,
      servicePopularity,
      maxMonthlyCount,
      maxServiceCount,
    };
  }, [bookings, services]);

  const statCards = [
    {
      label: "Total Bookings",
      value: reports.totalBookings,
      icon: CalendarCheck,
      helper: "All customer requests",
    },
    {
      label: "Confirmed",
      value: reports.confirmedBookings,
      icon: Star,
      helper: "Approved appointments",
    },
    {
      label: "Pending",
      value: reports.pendingBookings,
      icon: Clock,
      helper: "Waiting for admin review",
    },
    {
      label: "Cancelled",
      value: reports.cancelledBookings,
      icon: XCircle,
      helper: "Customer/admin cancellations",
    },
    {
      label: "Estimated Revenue",
      value: `$${reports.estimatedRevenue.toFixed(2)}`,
      icon: DollarSign,
      helper: "Based on confirmed bookings",
    },
    {
      label: "Top Service",
      value: reports.mostBookedService,
      icon: BarChart3,
      helper: "Most requested service",
    },
  ];

  if (loading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-500">
        Loading reports...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
          Admin
        </p>
        <h1 className="text-3xl font-bold text-slate-900">Reports</h1>
        <p className="mt-1 text-slate-600">
          Track bookings, revenue, monthly activity, and service popularity.
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon;

          return (
            <div
              key={card.label}
              className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-500">
                    {card.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {card.value}
                  </p>
                </div>

                <div className="rounded-2xl bg-indigo-50 p-3 text-indigo-600">
                  <Icon className="h-6 w-6" />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">{card.helper}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Monthly Bookings
            </h2>
            <p className="text-sm text-slate-500">
              Booking count by appointment month.
            </p>
          </div>

          <div className="space-y-3">
            {reports.monthlyCounts.map((item) => {
              const width = `${(item.count / reports.maxMonthlyCount) * 100}%`;

              return (
                <div key={item.month} className="grid grid-cols-[44px_1fr_36px] items-center gap-3">
                  <p className="text-sm font-semibold text-slate-500">
                    {item.month}
                  </p>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600"
                      style={{ width }}
                    />
                  </div>

                  <p className="text-right text-sm font-bold text-slate-700">
                    {item.count}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Service Popularity
            </h2>
            <p className="text-sm text-slate-500">
              See which services customers request most.
            </p>
          </div>

          {reports.servicePopularity.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No booking data yet.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.servicePopularity.map((item) => {
                const width = `${(item.count / reports.maxServiceCount) * 100}%`;

                return (
                  <div key={item.service}>
                    <div className="mb-1 flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-slate-800">
                        {item.service}
                      </p>
                      <p className="text-sm font-semibold text-slate-500">
                        {item.count}
                      </p>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-emerald-500"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-900">Status Breakdown</h2>
        <p className="mt-1 text-sm text-slate-500">
          A quick look at where bookings currently stand.
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl bg-amber-50 p-4">
            <p className="text-sm font-semibold text-amber-700">Pending</p>
            <p className="mt-1 text-2xl font-bold text-amber-900">
              {reports.pendingBookings}
            </p>
          </div>

          <div className="rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm font-semibold text-emerald-700">Confirmed</p>
            <p className="mt-1 text-2xl font-bold text-emerald-900">
              {reports.confirmedBookings}
            </p>
          </div>

          <div className="rounded-2xl bg-red-50 p-4">
            <p className="text-sm font-semibold text-red-700">Declined</p>
            <p className="mt-1 text-2xl font-bold text-red-900">
              {reports.declinedBookings}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-100 p-4">
            <p className="text-sm font-semibold text-slate-700">Cancelled</p>
            <p className="mt-1 text-2xl font-bold text-slate-900">
              {reports.cancelledBookings}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
