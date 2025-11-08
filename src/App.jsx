import { Routes, Route, Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import Home from "./Home.jsx";
import TermsPage from "./Terms.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-screen bg-white border-b border-gray-200">
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-3">
          <div className="flex items-center gap-2">
            <img
              src="/logo.jpg"
              alt="Common Time Logo"
              className="h-8 w-8 object-contain"
            />
            {/* Brand Name */}
            <div className="flex items-center gap-1 text-[32px] md:text-[var(--brand-size,32px)] leading-[1.1]">
              <span className="font-[Bai_Jamjuree] font-light text-gray-900 tracking-tight">
                COMMON
              </span>
              <span className="font-[Garet_Book] font-black italic text-gray-900/90 tracking-tight">
                TIME
              </span>
            </div>
          </div>

          {/* Socials + Menu */}
          <nav className="flex items-center gap-2">
            {/* Menu Button */}
            <button
              onClick={() => window.open("/menu.pdf", "_blank")}
              className="px-4 py-2 font-semibold text-black hover:text-gray-700 transition-colors"
            >
              Menu
            </button>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/itscommontime?igsh=YzYxeDViNXVtampr"
              target="_blank"
              rel="noreferrer"
              className="w-10 h-10 grid place-items-center text-gray-900 text-lg border border-gray-200 rounded-full transition-colors hover:bg-gray-100"
            >
              <FaInstagram />
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white text-center py-6 md:py-9 text-gray-900 text-sm font-poppins">
        <p>© {new Date().getFullYear()} Common Time • All rights reserved</p>
        <Link
          to="/terms"
          className="mt-2 inline-block text-gray-900 font-medium hover:underline"
        >
          Terms & Conditions
        </Link>
      </footer>
    </div>
  );
}
