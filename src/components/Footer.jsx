import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-white text-center py-6 md:py-9 text-gray-900 text-sm font-poppins border-t border-gray-200">
      <p>© {new Date().getFullYear()} Common Time • All rights reserved</p>
      <Link
        to="/terms"
        className="mt-2 inline-block text-gray-900 font-medium hover:underline"
      >
        Terms & Conditions
      </Link>
    </footer>
  );
}
