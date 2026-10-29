
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-bold">
            tribe<span className="text-green-400">green</span>
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
            Thoughtful corporate gifts that build meaningful relationships.
            From employee welcome kits to memorable client gifts.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-gray-400">
            <li><a href="/#products" className="hover:text-white">Our Products</a></li>
            <li><a href="/#about" className="hover:text-white">About Us</a></li>
            <li><a href="/#contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        <div id="contact">
          <h3 className="font-semibold">Corporate Gifting</h3>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Looking for gifts for your team, clients or business events?
            Explore our catalogue and send us an enquiry.
          </p>
          <a
            href="/#products"
            className="mt-4 inline-block text-sm font-semibold text-green-400 hover:text-green-300"
          >
            Browse the catalogue →
          </a>
        </div>
      </div>

      <div className="border-t border-gray-800 px-5 py-5 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Tribe Green. All rights reserved.
      </div>
    </footer>
  );
}
