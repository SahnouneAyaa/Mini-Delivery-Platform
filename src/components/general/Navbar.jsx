"use client";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, User } from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div className="flex items-center justify-end p-4 border-b border-slate-200 bg-white">
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="flex items-center gap-3 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
            <User size={16} className="text-white" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-slate-800 leading-tight">
              {session?.user?.username}
            </p>
            <p className="text-xs text-slate-400 leading-tight">
              {session?.user?.email}
            </p>
          </div>
        </button>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {session?.user?.username}
              </p>
              <p className="text-xs text-slate-400 truncate">
                {session?.user?.email}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} strokeWidth={1.8} />
              Se déconnecter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Navbar;