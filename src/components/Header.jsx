import { FiShoppingBag } from "react-icons/fi";
import { FaInstagram } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-screen bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-4 md:px-6 py-3 gap-3">
        {/* Logo & Brand */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/logo.jpg"
            alt="Common Time Logo"
            className="h-8 w-8 object-contain"
          />
          <div className="flex items-center gap-1 leading-[1.1]">
            <span className="font-[Bai_Jamjuree] font-light text-gray-900 tracking-tight text-xl sm:text-2xl md:text-3xl lg:text-[32px]">
              COMMON
            </span>
            <span className="font-[Garet_Book] font-black italic text-gray-900/90 tracking-tight text-xl sm:text-2xl md:text-3xl lg:text-[32px]">
              TIME
            </span>
          </div>
        </Link>

        {/* Menu + Icons */}
        <nav className="flex items-center gap-3">
          {/* Menu (Text Only) */}
          <button
            onClick={() => window.open("/menu.pdf", "_blank")}
            className="px-4 h-9 sm:h-10 flex items-center justify-center text-gray-900 text-sm sm:text-base border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
            title="View Menu"
          >
            Menu
          </button>

          {/* Merchandise Icon */}
          <Link
            to="/merch"
            className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center text-gray-900 text-lg sm:text-xl border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
            title="Merchandise"
          >
            <FiShoppingBag />
          </Link>

          {/* Instagram Icon */}
          <a
            href="https://www.instagram.com/itscommontime?igsh=YzYxeDViNXVtampr"
            target="_blank"
            rel="noreferrer"
            className="w-9 h-9 sm:w-10 sm:h-10 grid place-items-center text-gray-900 text-lg sm:text-xl border border-gray-200 rounded-full hover:bg-gray-100 transition-colors"
            title="Instagram"
          >
            <FaInstagram />
          </a>
        </nav>
      </div>
    </header>
  );
}
