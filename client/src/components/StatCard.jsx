function StatCard({ label, value, note }) {
  return (
    <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-lg sm:p-6">
      <p className="text-sm font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <h3 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
        {value}
      </h3>

      {note && (
        <p className="mt-2 text-sm font-semibold text-slate-500">{note}</p>
      )}
    </div>
  );
}

export default StatCard;
