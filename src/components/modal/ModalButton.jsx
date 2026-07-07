"use client";

function ModalButton({ children, onClick, bgColor = "bg-slate-100", textColor = "text-slate-700", disabled = false, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2.5 rounded-[10px] text-[13px] font-bold border-none cursor-pointer transition-opacity disabled:opacity-60 ${bgColor} ${textColor}`}
    >
      {children}
    </button>
  );
}

export default ModalButton;