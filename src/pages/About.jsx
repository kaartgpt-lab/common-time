import { Link } from "react-router-dom";
import SplitSection from "../components/editorial/SplitSection";
import FounderManifesto from "../components/editorial/AboutQuote.jsx";
import HeroSection from "../components/editorial/HeroSection.jsx";
import AboutHero from "../components/editorial/AboutHero.jsx";
import AboutValues from "../components/editorial/AboutValues.jsx";
export default function About() {
  return (
    <main className="flex flex-col font-[Garet_Book] text-slate-900 antialiased bg-[#F9F7F2]">
      {/* 1. HERO SECTION */}
      <AboutHero/>
      <FounderManifesto/>
      {/* 2. OUR STORY */}
      <AboutValues/>
     

     
    </main>
  );
}