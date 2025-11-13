import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import TermsPage from "./pages/Terms.jsx";
import Merch from "./pages/Merch.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/merch" element={<Merch />} />
          <Route path="/merch/:id" element={<ProductPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
