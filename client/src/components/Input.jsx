function Input({ label, name, value, onChange, type = "text", placeholder }) {
  return (
    <div>
      <label className="mb-2 block font-bold text-slate-800">{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-700"
      />
    </div>
  );
}

export default Input;
