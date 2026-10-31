import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

interface AdminLayoutProps {
  children: ReactNode;
  onLogout: () => void;
  loggingOut: boolean;
}

export default function AdminLayout({
  children,
  onLogout,
  loggingOut,
}: AdminLayoutProps) {
  const [open, setOpen] = useState(false);

  const sidebar = (
    <div className="flex h-full flex-col bg-[#0F3D22] text-white">
      <div className="px-6 py-6">
        <Link to="/" aria-label="Tribe Green website">
          <img
            src="/logo-lockup-dark.svg"
            alt="Tribe Green"
            className="h-9 w-auto"
          />
        </Link>
        <p className="mt-4 text-[11px] font-bold uppercase tracking-[2px] text-[#E3C98F]">
          Admin panel
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        <span className="flex items-center rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold">
          Enquiries
        </span>
       
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl border border-[#B8924A] px-4 text-sm font-semibold text-[#E3C98F] transition hover:bg-[#B8924A] hover:text-[#0F3D22] disabled:opacity-60"
        >
          {loggingOut ? "Logging out..." : "Log out"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FAF6EE] lg:pl-64">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        {sidebar}
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#EFE8D8] bg-[#FAF6EE]/95 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7DFCB] bg-white text-[#14532D]"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M4 7h16M4 12h16M4 17h16" />
          </svg>
        </button>
        <span className="text-sm font-bold text-[#14532D]">Admin panel</span>
        <span className="w-11" />
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-64 shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <main>{children}</main>
    </div>
  );
}