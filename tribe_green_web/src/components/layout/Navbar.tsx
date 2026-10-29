
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="text-2xl font-bold tracking-tight text-green-800">
          tribe<span className="text-green-500">green</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm text-gray-700 hover:text-green-700">
            Home
          </Link>
          <a href="/#products" className="text-sm text-gray-700 hover:text-green-700">
            Products
          </a>
          <a href="/#about" className="text-sm text-gray-700 hover:text-green-700">
            About Us
          </a>
          <a href="/#contact" className="text-sm text-gray-700 hover:text-green-700">
            Contact
          </a>
        </div>

        <a
          href="/#products"
          className="rounded-full bg-green-800 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-900"
        >
          Explore Gifts
        </a>
      </nav>
    </header>
  );
}
