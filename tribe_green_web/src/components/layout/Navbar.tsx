import { useState } from "react";
import { Link } from "react-router-dom";

const linkClass =
  "rounded-lg px-3 py-2 text-sm font-medium text-stone-700 transition hover:bg-[#F1F7F2] hover:text-[#14532D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D]";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#EFE8D8] bg-[#FAF6EE]/95 backdrop-blur">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-8">
       <Link to="/" aria-label="Tribe Green home">
  <img
    src="/logo-lockup.svg"
    alt="Tribe Green"
    className="h-10 w-auto"
  />
</Link>

        <div className="hidden items-center gap-1 md:flex">
          <Link to="/" className={linkClass}>
            Home
          </Link>
          <a href="/#products" className={linkClass}>
            Products
          </a>
          <a href="/#about" className={linkClass}>
            About Us
          </a>
          <a href="/#contact" className={linkClass}>
            Contact
          </a>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/#products"
            className="hidden rounded-full bg-[#14532D] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0F3D22] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#14532D] focus-visible:ring-offset-2 sm:inline-flex"
          >
            Explore Gifts
          </a>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E7DFCB] bg-white text-[#14532D] md:hidden"
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
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-[#EFE8D8] bg-white px-5 pb-5 pt-3 md:hidden">
          <div className="flex flex-col">
            <Link to="/" onClick={close} className={`${linkClass} py-3`}>
              Home
            </Link>
            <a href="/#products" onClick={close} className={`${linkClass} py-3`}>
              Products
            </a>
            <a href="/#about" onClick={close} className={`${linkClass} py-3`}>
              About Us
            </a>
            <a href="/#contact" onClick={close} className={`${linkClass} py-3`}>
              Contact
            </a>
          </div>

          <a
            href="/#products"
            onClick={close}
            className="mt-3 flex items-center justify-center rounded-full bg-[#14532D] px-5 py-3 text-sm font-semibold text-white"
          >
            Explore Gifts
          </a>
        </div>
      )}
    </header>
  );
}