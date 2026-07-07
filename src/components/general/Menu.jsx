"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Menu({ links }) {
  const pathname = usePathname();
  const isActive = (href) => pathname === href || pathname.startsWith(href + "/");

  const linkBase =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-md transition-all duration-300 ease-in-out transform text-white";

  const getLinkClasses = (href) => {
    const active = isActive(href);
    return `${linkBase} ${
      active
        ? "bg-white/15 font-semibold translate-x-1.5 shadow-lg shadow-black/5"
        : "font-normal hover:bg-white/10 hover:translate-x-1.5 active:scale-95"
    }`;
  };

  return (
    <nav className="flex flex-col flex-1 mt-6 space-y-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link key={href} href={href} className={getLinkClasses(href)}>
          <Icon size={19} strokeWidth={isActive(href) ? 2.2 : 1.8} />
          <span className="hidden lg:block">{label}</span>
        </Link>
      ))}
    </nav>
  );
}

export default Menu;