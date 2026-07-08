"use client";
import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const ModalInput = forwardRef(
  ({ label, type = "text", placeholder, error, icon: Icon, ...rest }, ref) => {
    const isPassword = type === "password";
    const [visible, setVisible] = useState(false);
    const inputType = isPassword ? (visible ? "text" : "password") : type;

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
            type={inputType}
            placeholder={placeholder}
            className="w-full text-sm text-slate-800 placeholder:text-slate-400 outline-none bg-transparent"
            {...rest}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              className="shrink-0 text-slate-400 hover:text-slate-600 cursor-pointer"
              tabIndex={-1}
            >
              {visible ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <span className="text-xs text-red-500">{error}</span>}
      </div>
    );
  }
);

ModalInput.displayName = "ModalInput";
export default ModalInput;