"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

const items = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/tickets", label: "Tickets" },
  { href: "/admin/callback", label: "Callback Requests" },
  { href: "/admin/bonus", label: "Bonus Claims" },
  { href: "/admin/bonus-config", label: "Bonus List" },
  { href: "/admin/subjects", label: "Subjects" },
  { href: "/admin/button", label: "Buttons" },
  { href: "/admin/organisation", label: "Organisation" },
  { href: "/admin/footer-content", label: "Footer Content" },
  { href: "/admin/notifications", label: "Notifications" },
];

export default function AdminSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await api.post("/logout");
    router.replace("/admin/login");
  };

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-slate-900 text-white">
        <div className="font-bold text-lg">Admin Panel</div>

        <button onClick={() => setOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-slate-900 text-white transform transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800">
          <span className="font-bold text-lg">Admin Menu</span>
          <button onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>

        <nav className="p-2 space-y-1">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={`block px-4 py-3 rounded ${
                pathname === item.href ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <button onClick={logout} className="btn-danger w-full">
            Logout
          </button>
        </nav>
      </aside>

      <aside className="hidden md:inline fixed w-64 bg-slate-900 text-white h-screen">
        <div className="p-4 font-bold text-lg">Admin Panel</div>

        <nav className="space-y-1 px-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-3 py-2 rounded ${
                pathname === item.href ? "bg-slate-700" : "hover:bg-slate-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="md:hidden h-14" />
    </>
  );
}
