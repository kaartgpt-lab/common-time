import { Link } from "react-router-dom";

const NAV = [
  { label: "shop", href: "/shop" },
  { label: "menu", href: "/menu" },
  { label: "locations", href: "/locations/lodhi-colony" },
  { label: "journal", href: "/journal" },
  { label: "about", href: "/coming-soon" },
];

const LOCATIONS = [
  { name: "Lodhi Colony", area: "Meherchand Market" },
  { name: "Vasant Vihar", area: "Basant Lok" },
  { name: "Khan Market", area: "Rabindra Nagar" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] font-[Inter]">

      {/* Main grid */}
      <div className="max-w-[1200px] mx-auto px-5 md:px-6 pt-14 pb-12 md:pt-16 md:pb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">

          {/* Col 1 — Brand */}
          <div>
            <p className="font-[Inter] font-light text-white text-xl tracking-[0.15em] uppercase mb-2">
              Common Time
            </p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-white/30 mb-8">
              specialty coffee · new delhi
            </p>
            <div className="space-y-3">
              {LOCATIONS.map((loc) => (
                <div key={loc.name}>
                  <p className="text-[11px] text-white/60 font-[Inter]">{loc.name}</p>
                  <p className="text-[10px] text-white/30 uppercase tracking-[0.15em]">{loc.area}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Col 2 — Nav */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-white/25 mb-6">explore</p>
            <nav className="flex flex-col gap-3">
              {NAV.map(({ label, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="text-[13px] text-white/55 hover:text-white transition-colors duration-300 w-fit"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Col 3 — Connect */}
          <div>
            <p className="text-[9px] uppercase tracking-[0.45em] text-white/25 mb-6">connect</p>
            <div className="flex flex-col gap-4">
              <a
                href="https://www.instagram.com/common.time.coffee"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group w-fit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/35 group-hover:text-white transition-colors duration-300">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
                </svg>
                <span className="text-[12px] text-white/55 group-hover:text-white transition-colors duration-300">
                  @common.time.coffee
                </span>
              </a>

              <a
                href="mailto:hello@commontime.in"
                className="flex items-center gap-3 group w-fit"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white/35 group-hover:text-white transition-colors duration-300">
                  <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 7l10 7 10-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <span className="text-[12px] text-white/55 group-hover:text-white transition-colors duration-300">
                  hello@commontime.in
                </span>
              </a>
            </div>

            {/* Hours note */}
            <div className="mt-10">
              <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-2">hours</p>
              <p className="text-[12px] text-white/40">08:00 am — 10:00 pm</p>
              <p className="text-[10px] text-white/20 mt-1 uppercase tracking-[0.15em]">all locations</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/8 max-w-[1200px] mx-auto px-5 md:px-6 py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
            a concept by <span className="text-white/35">Bhatia Hospitality Group</span>
          </p>
          <p className="text-[10px] uppercase tracking-[0.25em] text-white/20">
            © {new Date().getFullYear()} common time · all rights reserved
          </p>
        </div>
      </div>

    </footer>
  );
}
