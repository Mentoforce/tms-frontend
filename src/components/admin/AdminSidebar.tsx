"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/tickets", label: "Tickets" },
  { href: "/admin/callback", label: "Callback Requests" },
  { href: "/admin/bonus", label: "Bonus" },
  { href: "/admin/organisations", label: "Organisations" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white">
      <div className="p-4 font-bold text-lg">Admin Panel</div>

      <nav className="space-y-1 px-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-3 py-2 rounded ${
              pathname.startsWith(item.href)
                ? "bg-slate-700"
                : "hover:bg-slate-800"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
