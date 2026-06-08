export default function CustomInput({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  name,
  maxLength,
  inputMode
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm text-gray-500 mb-1">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        autoComplete="new-password"
        maxLength={maxLength}
        inputMode={inputMode} // 🔥 important for mobile numeric keyboard
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
      />
    </div>
  );
}