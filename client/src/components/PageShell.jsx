function PageShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-slate-950">{title}</h1>
          <p className="mt-2 text-slate-600">{subtitle}</p>
        </div>

        {children}
      </div>
    </main>
  );
}

export default PageShell;
