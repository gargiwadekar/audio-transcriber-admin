import Link from "next/link";
import { AudioLines, LayoutDashboard, Search } from "lucide-react";

import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard?panel=recent", label: "Recent Uploads", icon: AudioLines },
  { href: "/dashboard?panel=search", label: "Search", icon: Search },
];

export function AppSidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white/90 px-6 py-8 lg:flex">
      <div className="mb-10 space-y-3">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-600/20">
          <AudioLines className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">Admin</p>
          <h1 className="mt-1 text-xl font-semibold text-slate-950">{APP_NAME}</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Upload short audio clips, review transcripts, and keep everything easy to search.
          </p>
        </div>
      </div>
      <nav className="space-y-2">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-950",
              href === "/dashboard" && "bg-blue-50 text-blue-700",
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-900">Quick note</p>
        <p className="mt-1 text-sm leading-6 text-slate-500">
          This project is set up for one admin account, making it simple to manage during the MVP stage.
        </p>
      </div>
    </aside>
  );
}
