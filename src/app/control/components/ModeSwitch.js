"use client";

export default function ModeSwitch({ mode, onChange }) {
  const Btn = ({ m, label }) => (
    <button
      onClick={() => onChange(m)}
      className={`px-3 py-1.5 text-sm rounded-md border ${
        mode === m
          ? "bg-[#DCE6DC] text-[#2F4635] border-[#C7D5C8]"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Mode</span>
      <Btn m="AUTO" label="Auto" />
      <Btn m="MANUAL" label="Manual" />
      
    </div>
  );
}
