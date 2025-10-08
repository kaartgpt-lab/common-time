// App.jsx
import { Routes, Route, Link } from "react-router-dom";
import { FaInstagram } from "react-icons/fa";
import Home from "./Home.jsx";
import TermsPage from "./Terms.jsx";

export default function App() {
  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Header */}
      <header style={headerStyles.header}>
        <div style={headerStyles.headerInner}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <img
              src="/logo.jpg"
              alt="Common Time Logo"
              style={{ height: "32px", width: "32px", objectFit: "contain" }}
            />
            <div style={headerStyles.brand}>Common Time</div>
          </div>
          <nav style={headerStyles.headerSocials}>
            <a
              href="https://www.instagram.com/itscommontime?igsh=YzYxeDViNXVtampr"
              target="_blank"
              rel="noreferrer"
              style={headerStyles.socialLink}
            >
              <FaInstagram />
            </a>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsPage />} />
        </Routes>
      </div>

      {/* Footer */}
      <footer style={footerStyles.footer}>
        <p>© {new Date().getFullYear()} Common Time • All rights reserved</p>
        <Link
          to="/terms"
          style={{
            color: "#0f172a",
            textDecoration: "none",
            fontWeight: 500,
            marginTop: "8px",
            display: "inline-block",
          }}
        >
          Terms & Conditions
        </Link>
      </footer>
    </div>
  );
}

/* Header Styles */
const headerStyles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    width: "100vw",
    background: "#ffffff", // changed to white
    borderBottom: "1px solid #e5e7eb",
  },
  headerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "var(--header-padding, 12px 20px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  brand: {
    fontFamily: '"Manrope", sans-serif',
    fontWeight: 700,
    letterSpacing: "-0.02em",
    fontSize: "var(--brand-size, 32px)",
    lineHeight: 1.1,
    whiteSpace: "nowrap",
    color: "#0f172a", // text black
  },
  headerSocials: {
    display: "flex",
    gap: 8,
    alignItems: "center",
    flexShrink: 0,
  },
  socialLink: {
    fontSize: 18,
    color: "#0f172a", // text black
    border: "1px solid #e5e7eb",
    borderRadius: "50%",
    width: "var(--social-size, 40px)",
    height: "var(--social-size, 40px)",
    display: "grid",
    placeItems: "center",
    transition: "background 0.2s, color 0.2s",
  },
};

/* Footer Styles */
const footerStyles = {
  footer: {
    fontFamily: '"Poppins", sans-serif',
    textAlign: "center",
    padding: "24px 0 36px",
    color: "#0f172a", // changed to black
    backgroundColor: "#ffffff", // changed to white
    fontSize: 14,
    lineHeight: 1.5,
  },
};
