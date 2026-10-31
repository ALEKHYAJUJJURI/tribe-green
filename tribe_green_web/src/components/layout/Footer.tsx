import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[#0F3D22] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:px-8">
        <div>
          <Link to="/" className="text-2xl font-extrabold tracking-tight">
            tribe<span className="text-[#E3C98F]">green</span>
          </Link>
          <div className="mt-3 h-[3px] w-10 rounded-full bg-[#B8924A]" />
          <p className="mt-4 max-w-sm text-sm leading-6 text-green-100/70">
            Thoughtful corporate gifts that build meaningful relationships.
            From employee welcome kits to memorable client gifts.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#E3C98F]">
            Explore
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-green-100/70">
            <li>
              <a href="/#products" className="transition hover:text-white">
                Our Products
              </a>
            </li>
            <li>
              <a href="/#about" className="transition hover:text-white">
                About Us
              </a>
            </li>
            <li>
              <a href="/#contact" className="transition hover:text-white">
                Contact
              </a>
            </li>
          </ul>
        </div>

        <div id="contact">
          <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#E3C98F]">
            Corporate Gifting
          </h3>
          <p className="mt-5 text-sm leading-6 text-green-100/70">
            Looking for gifts for your team, clients or business events?
            Explore our catalogue and send us an enquiry.
          </p>
          <a
            href="/#products"
            className="mt-5 inline-flex rounded-full border border-[#B8924A] px-5 py-2.5 text-sm font-semibold text-[#E3C98F] transition hover:bg-[#B8924A] hover:text-[#0F3D22]"
          >
            Browse the catalogue →
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-green-100/50">
        © {new Date().getFullYear()} Tribe Green. All rights reserved.
      </div>
    </footer>
  );
}