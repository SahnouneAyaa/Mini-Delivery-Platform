"use client";
import { forwardRef } from "react";

const ModalInput = forwardRef(
  ({ label, type = "text", placeholder, error, icon: Icon, ...rest }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-sm font-medium text-slate-700">{label}</label>}
        <div
          className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 bg-white transition-colors ${
            error
              ? "border-red-400 focus-within:border-red-500"
              : "border-slate-200 focus-within:border-orange-500"
          }`}
        >
          {Icon && <Icon size={16} className="text-slate-400 shrink-0" />}
          <input
            ref={ref}
            type={type}
            placeholder={placeholder}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            {...rest}
          />
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

ModalInput.displayName = "ModalInput";
export default ModalInput;